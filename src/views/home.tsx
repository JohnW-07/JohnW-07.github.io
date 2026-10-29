import { WipeLink } from "@/components/stage/wipe-link";
import { home } from "@/data/home";
import { PHOTOS } from "@/lib/field/constants";
import { Words } from "@/views/shared/words";

const INNER = 36;
const row = ({ n, label, year }: (typeof home.rows)[number]) => `║ ${n}  ${label.padEnd(22)} → ${year}  ║`;

/** Home: R18 B hero name over the photo field, status chip, selected-work box (R14). */
export const HomeView = () => (
  <>
    <h1 className="hero">
      <Words text="John" />
      <br /> <Words text="Wu" />
    </h1>
    <pre className="chipl" data-c="mute">{home.chip}</pre>
    <nav className="box" aria-label={home.boxTitle}>
      <pre data-c="mid">{`╔${`══ ${home.boxTitle} `.padEnd(INNER, "═")}╗`}</pre>
      {home.rows.map((r) => (
        <WipeLink key={r.slug} href={`/work/${r.slug}`} data-c="mid">
          {row(r)}
        </WipeLink>
      ))}
      <pre data-c="mid">{`╚${"═".repeat(INNER)}╝`}</pre>
    </nav>
    <pre className="edge" data-c="mute">{home.frameLabel(1, PHOTOS[0][2])}</pre>
  </>
);
