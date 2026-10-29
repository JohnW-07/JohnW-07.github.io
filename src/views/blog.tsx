import { blog, posts } from "@/data/blog";
import { Words } from "@/views/shared/words";

const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

/** Blog: the post index, right-titled (R14 `blogPage`). Rows are not links until posts have pages. */
export const BlogView = () => (
  <>
    <h1 className="rt">
      <Words text={blog.title} />
    </h1>
    <pre className="sub rt" data-c="mute">{blog.sub}</pre>
    {sorted.length ? (
      <ol className="idx">
        {sorted.map((p, i) => (
          <li key={p.date + p.title}>
            <div data-p="mute">
              <span data-c="mute">{String(i + 1).padStart(2, "0")}</span>
              <span data-c="mute">{p.date}</span>
              <span className="t" data-c="mid">{p.title}</span>
              <span data-c="mute">{p.summary}</span>
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className="idx" data-c="mid">{blog.empty}</p>
    )}
    <pre className="foot" data-c="mute">{blog.foot}</pre>
  </>
);
