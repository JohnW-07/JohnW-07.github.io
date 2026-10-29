import { HUES } from "./constants";
import { themeSplit, type Cells, type GlyphSink } from "./atlas";

const FLOATS = 5; // x, y, atlas u, atlas v, alpha per instance

const VERT = `in vec2 q; in vec4 d; in float a; uniform vec2 view, tex, tile; out vec2 uv; out float al;
void main() { vec2 p = d.xy + q * tile; gl_Position = vec4(p.x / view.x * 2. - 1., 1. - p.y / view.y * 2., 0, 1); uv = (d.zw + q * tile) / tex; al = a; }`;
const FRAG = "in vec2 uv; in float al; uniform sampler2D t; out vec4 o; void main() { o = texture(t, uv) * al; }";

/**
 * Field glyphs as one instanced WebGL2 draw per frame (M:401–418): same atlas,
 * order and premultiplied source-over blend as the 2D path. Null when the
 * shader fails to link.
 */
export const createGlBatch = (gl: WebGL2RenderingContext, atlases: HTMLCanvasElement[], cells: Cells, n: number, TH: Float32Array): GlyphSink | null => {
  const cv = gl.canvas;
  const pr = gl.createProgram();
  const shaders = ([[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const).map(([type, src]) => {
    const o = gl.createShader(type)!;
    gl.shaderSource(o, "#version 300 es\nprecision highp float;\n" + src);
    gl.compileShader(o);
    gl.attachShader(pr, o);
    return o;
  });
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);

  const at = document.createElement("canvas");
  at.width = atlases[0].width; at.height = 2 * atlases[0].height;
  const ax = at.getContext("2d")!;
  atlases.forEach((A, k) => ax.drawImage(A, 0, k * A.height));
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, at);
  for (const [p, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
    gl.texParameteri(gl.TEXTURE_2D, p, v);
  for (const [name, x, y] of [["view", cv.width, cv.height], ["tex", at.width, at.height], ["tile", cells.aw, cells.ah]] as const)
    gl.uniform2f(gl.getUniformLocation(pr, name), x, y);

  const attr = (name: string, size: number, stride: number, off: number, div: number) => {
    const l = gl.getAttribLocation(pr, name);
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, off);
    gl.vertexAttribDivisor(l, div);
  };
  const quad = gl.createBuffer(), inst = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  attr("q", 2, 0, 0, 0);
  const D = new Float32Array(n * 2 * FLOATS);
  gl.bindBuffer(gl.ARRAY_BUFFER, inst);
  gl.bufferData(gl.ARRAY_BUFFER, D.byteLength, gl.DYNAMIC_DRAW);
  attr("d", 4, FLOATS * 4, 0, 1);
  attr("a", 1, FLOATS * 4, 16, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.viewport(0, 0, cv.width, cv.height);
  gl.clearColor(0, 0, 0, 0);

  const { cw, ch, aw, ah } = cells;
  let count = 0, live = false;
  return {
    push: (g, hI, a, c, r, i) =>
      themeSplit(a, TH[i], (k, aa) => {
        const o = count++ * FLOATS;
        D[o] = c * cw - 1; D[o + 1] = r * ch - 1; D[o + 2] = g * aw; D[o + 3] = (k * HUES + hI) * ah; D[o + 4] = Math.min(1, aa);
      }),
    begin: () => {},
    end: () => {
      if (!count && !live) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (count) { gl.bufferSubData(gl.ARRAY_BUFFER, 0, D, 0, count * FLOATS); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count); }
      live = count > 0;
      count = 0;
    },
    destroy: () => {
      gl.deleteBuffer(quad); gl.deleteBuffer(inst); gl.deleteTexture(tex);
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteProgram(pr);
    },
  };
};
