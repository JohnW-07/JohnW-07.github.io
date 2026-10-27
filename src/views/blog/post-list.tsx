import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import type { BlogPost } from "@/data/types";

interface PostListProps {
  posts: readonly BlogPost[];
  emptyNote: string;
}

const byNewest = (a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date);

/** The posts, newest first, or the empty note while there are none. */
export const PostList = ({ posts, emptyNote }: PostListProps) => (
  <section aria-label="Posts" className="px-gutter pb-24 lg:px-page lg:pb-32">
    {posts.length === 0 ? (
      <Reveal delay={420} className="max-w-[46ch] border-t border-line pt-6">
        <p className="text-body text-ink-2">{emptyNote}</p>
      </Reveal>
    ) : (
      <ol className="border-t border-line">
        {[...posts].sort(byNewest).map((post) => (
          <li key={`${post.date}-${post.title}`} className="border-b border-line py-6">
            <article>
              <MonoLabel as="p">
                <time dateTime={post.date}>{post.date}</time>
              </MonoLabel>
              <h2 className="text-display-sm mt-2 font-display text-ink">{post.title}</h2>
              <p className="text-body mt-3 max-w-[60ch] text-ink-2">{post.summary}</p>
            </article>
          </li>
        ))}
      </ol>
    )}
  </section>
);
