import Image from "next/image";
import type { CSSProperties } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { frames, photoPage, photoSets } from "@/data/photography";
import type { PhotoFrame } from "@/data/types";
import { getGalleryStructuredData } from "@/utils/seo/structured-data";
import { Words } from "@/views/shared/words";

const Frame = ({ f, sizes }: { f: PhotoFrame; sizes: string }) => (
  <figure data-p="mute" style={{ "--ar": (f.w / f.h).toFixed(4) } as CSSProperties}>
    <Image src={f.src} alt={f.alt} width={f.w} height={f.h} sizes={sizes} draggable={false} />
    <figcaption data-c="mute">{f.name}</figcaption>
  </figure>
);

/** Photography: one section per set, a justified highlights row then every frame (R14 `photoPage`). */
export const PhotographyView = () => (
  <div className="ps">
    <JsonLd data={getGalleryStructuredData(Object.values(frames))} />
    <h1>
      <Words text={photoPage.title} />
    </h1>
    <pre className="sub" data-c="mute">{photoPage.sub}</pre>
    {photoSets.map((s) => (
      <section key={s.n} className="set" aria-label={s.title}>
        <header className="set-h">
          <h2 className="t" data-c="mid">{`${s.n} · ${s.title}`}</h2>
          <pre data-c="mute">{`${s.meta} · ${photoPage.count(s.frames.length)}`}</pre>
        </header>
        <pre className="gl" data-c="mute">{photoPage.highlights}</pre>
        <div className="hl">
          {s.highlights.map((id) => (
            <Frame key={id} f={frames[id]} sizes="(max-width: 1099px) 100vw, 50vw" />
          ))}
        </div>
        <pre className="gl" data-c="mute">{photoPage.all}</pre>
        <div className="grid">
          {s.frames.map((id) => (
            <Frame key={id} f={frames[id]} sizes="(max-width: 1099px) 50vw, 17vw" />
          ))}
        </div>
      </section>
    ))}
  </div>
);
