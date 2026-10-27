import { blog, posts } from "@/data/blog";
import { BlogMasthead } from "@/views/blog/blog-masthead";
import { PostList } from "@/views/blog/post-list";

/** Blog — a masthead and the list of posts, in the lab theme. */
export const BlogView = () => (
  <main>
    <BlogMasthead lede={blog.lede} postCount={posts.length} />
    <PostList posts={posts} emptyNote={blog.empty} />
  </main>
);
