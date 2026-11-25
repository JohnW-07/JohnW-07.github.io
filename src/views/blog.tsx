import { WipeLink } from "@/components/stage/wipe-link";
import { blog } from "@/data/blog";
import { blogPosts, postPath } from "@/data/blog-posts";
import { Words } from "@/views/shared/words";

/** Blog post index, right-titled (R14 `blogPage`). */
export const BlogView = () => (
  <>
    <h1 className="rt">
      <Words text={blog.title} />
    </h1>
    <pre className="sub rt" data-c="mute">{blog.sub}</pre>
    {blogPosts.length ? (
      <ol className="idx">
        {blogPosts.map((p, i) => (
          <li key={p.slug}>
            <WipeLink className="blog-index-link" href={postPath(p)} data-p="mute">
              <span data-c="mute">{String(i + 1).padStart(2, "0")}</span>
              <time data-c="mute" dateTime={p.date}>{p.date}</time>
              <span className="t" data-c="mid">{p.title}</span>
            </WipeLink>
          </li>
        ))}
      </ol>
    ) : (
      <p className="idx" data-c="mid">{blog.empty}</p>
    )}
    <pre className="foot" data-c="mute">{blog.foot}</pre>
  </>
);
