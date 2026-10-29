import { WipeLink } from "@/components/stage/wipe-link";
import { allProjectsPage, also } from "@/data/projects-page";
import { projects } from "@/data/projects";
import { Words } from "@/views/shared/words";

const pages = [...projects.filter((p) => p.hasPage)].sort((a, b) => b.start.localeCompare(a.start));

/** All projects: case studies newest first, then work without a page (R14 `allPage`). */
export const ProjectsAllView = () => (
  <>
    <h1>
      <Words text={allProjectsPage.title} />
    </h1>
    <pre className="sub" data-c="mute">{allProjectsPage.sub(pages.length, also.length)}</pre>
    <ol className="idx all">
      {pages.map((p, i) => (
        <li key={p.slug}>
          <WipeLink href={`/work/${p.slug}`} data-p="mute">
            <span data-c="mute">{String(i + 1).padStart(2, "0")}</span>
            <span data-c="mute">{p.period}</span>
            <span className="t" data-c="mid">{p.title}</span>
            <span data-c="mute">{p.discipline}</span>
          </WipeLink>
        </li>
      ))}
      {also.map(([d, t]) => (
        <li key={t}>
          <div data-p="mute">
            <span data-c="mute">··</span>
            <span data-c="mute">{d}</span>
            <span data-c="mute">{t}</span>
            <span data-c="mute">{allProjectsPage.noPage}</span>
          </div>
        </li>
      ))}
    </ol>
    <WipeLink className="foot" href="/projects" data-c="mute">
      {allProjectsPage.back}
    </WipeLink>
  </>
);
