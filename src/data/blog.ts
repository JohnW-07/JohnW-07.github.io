import type { BlogPost } from "@/data/types";

/**
 * Blog.
 *
 * Nothing has been written yet, so `posts` ships empty and the page renders an
 * honest empty state rather than invented entries. Add a post by appending to
 * `posts`; the list sorts by `date`, so order here does not matter.
 */

export const blog = {
  /** Meta description for `/blog`. */
  description: "Writing from John Wu: notes on the work, posted as they are written.",
  /** Opening line. Set large, in the display face. */
  lede: "Notes on the work, written down as it happens.",
  /** Shown in place of the list while `posts` is empty. */
  empty: "Nothing posted yet. Entries go up as they are written.",
} as const;

export const posts: readonly BlogPost[] = [];
