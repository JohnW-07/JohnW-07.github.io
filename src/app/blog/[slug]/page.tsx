import { BlogPostView, postMetadata, postParams } from "@/views/blog/post";

export const dynamicParams = false;
export const generateStaticParams = postParams;
export const generateMetadata = postMetadata;

export default BlogPostView;
