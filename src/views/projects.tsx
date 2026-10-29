import { WipeLink } from "@/components/stage/wipe-link";
import { projectsPage } from "@/data/projects-page";
import { projects } from "@/data/projects";
import { Tick, TimelineEntry } from "@/views/projects/timeline-entry";
import { Words } from "@/views/shared/words";

/** Projects: R4 A timeline, each project at its start month, research above the curve (R14). */
export const ProjectsView = () => (
  <>
    <h1>
      <Words text={projectsPage.title} />
    </h1>
    <pre className="sub" data-c="mute">{projectsPage.sub}</pre>
    {projectsPage.ticks.map((t) => (
      <Tick key={t.text} {...t} />
    ))}
    {projects.map((p) => (
      <TimelineEntry key={p.slug} p={p} />
    ))}
    <pre className="foot" data-c="mute">{projectsPage.foot}</pre>
    <div className="box end">
      <WipeLink href="/projects/all" data-c="mid" aria-label={projectsPage.allLabel}>
        {projectsPage.allBox}
      </WipeLink>
    </div>
  </>
);
