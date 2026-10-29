import { CopyButton } from "@/components/ui/copy-button";
import { contact, contactPage } from "@/data/contact";
import { Words } from "@/views/shared/words";

const { keys } = contactPage;
const bare = (url: string) => url.replace(/^https?:\/\//, "");
const open = (href: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" data-c="acc">
    {contactPage.open}
  </a>
);

/** Contact (R14 Contact A): the address large, copy and write, then every other route in. */
export const ContactView = () => (
  <>
    <h1>
      <Words text={contactPage.title} />
    </h1>
    <pre className="sub" data-c="mute">{contactPage.sub}</pre>
    <a className="addr" href={`mailto:${contact.email.primary}`} data-c="mid">
      {contact.email.primary}
    </a>
    <p className="acts">
      <CopyButton text={contact.email.primary} labels={contactPage.copy} />{" "}
      <a href={`mailto:${contact.email.primary}`} data-c="acc">{contactPage.write}</a>
    </p>
    <p className="note" data-c="mid">{contactPage.note}</p>
    <dl className="kv">
      {([[keys.github, contact.github], [keys.linkedin, contact.linkedin]] as const).map(([k, url]) => (
        <div key={k}>
          <dt data-c="mute">{k}</dt>
          <dd><span data-c="mid">{bare(url)}</span> {open(url)}</dd>
        </div>
      ))}
      <div>
        <dt data-c="mute">{keys.school}</dt>
        <dd><span data-c="mid">{contact.email.school}</span> <a href={`mailto:${contact.email.school}`} data-c="acc">{contactPage.write}</a></dd>
      </div>
      <div>
        <dt data-c="mute">{keys.resume}</dt>
        <dd><span data-c="mid">{contactPage.resume}</span> {open(contact.resume.href)}</dd>
      </div>
      <div>
        <dt data-c="mute">{keys.based}</dt>
        <dd data-c="mid">{contact.based}</dd>
      </div>
    </dl>
  </>
);
