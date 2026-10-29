import { Fragment } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { WipeLink } from "@/components/stage/wipe-link";
import { contact } from "@/data/contact";
import { credentials, education, experience, publication, skills } from "@/data/profile";
import { resumePage } from "@/data/resume-page";
import { PLACEHOLDER } from "@/data/types";
import { shortPeriod } from "@/lib/format";
import { getResumeStructuredData } from "@/utils/seo/structured-data";
import { Words } from "@/views/shared/words";

const { keys, sections } = resumePage;

const groups: readonly (readonly [string, readonly (readonly [string, string])[]])[] = [
  [sections.education, [
    [keys.school, education.school],
    [keys.degree, education.degree],
    [keys.graduation, education.graduation],
    [keys.gpa, education.gpa],
    [keys.minors, education.minors.join(" · ")],
    [keys.program, education.program],
  ]],
  [sections.credentials, credentials.map((c) => [c.year === PLACEHOLDER ? "—" : c.year, c.label] as const)],
  [sections.skills, skills.map((s) => [s.heading.toLowerCase(), s.items.join(" · ")] as const)],
];

/** Résumé: experience as an index on the left, the rest as spec blocks on the right. */
export const ResumeView = () => (
  <>
    <JsonLd data={getResumeStructuredData()} />
    <h1>
      <Words text={resumePage.title} />
    </h1>
    <pre className="sub" data-c="mute">{resumePage.sub}</pre>
    <a className="dl" href={contact.resume.href} data-c="acc" download>
      {resumePage.download}
    </a>
    <ol className="idx xp">
      {experience.map((e, i) => {
        const cells = (
          <>
            <span data-c="mute">{String(i + 1).padStart(2, "0")}</span>
            <span data-c="mute">{shortPeriod(e.period)}</span>
            <span className="t" data-c="mid">{e.role}</span>
            <span data-c="mute">{e.org}</span>
          </>
        );
        return (
          <li key={e.org + e.period}>
            {e.project ? (
              <WipeLink href={`/work/${e.project}`} data-p="mute">{cells}</WipeLink>
            ) : (
              <div data-p="mute">{cells}</div>
            )}
          </li>
        );
      })}
    </ol>
    <div className="spec ko rs">
      {groups.map(([h, rows]) => (
        <section key={h} aria-label={h.toLowerCase()}>
          <h2 data-c="mute">{h}</h2>
          <dl>
            {rows.map(([k, v]) => (
              <Fragment key={k + v}>
                <dt data-c="mute">{k}</dt>
                <dd data-c="mid">{v}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      ))}
    </div>
    <pre className="foot" data-c="mute">{`${publication.label} · ${publication.venue} · ${publication.detail}`}</pre>
  </>
);
