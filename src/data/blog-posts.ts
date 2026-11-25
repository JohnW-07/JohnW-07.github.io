import { z } from "zod";

import content from "../../content/blog-posts.json";

const text = z.string().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const citation = z.object({ name: text, url: z.url() });
const photo = z.object({
  file: text.regex(/^[a-z0-9-]+\.webp$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: text,
  caption: text,
  credit: text,
  source: z.url(),
  license: citation.optional(),
});

const post = z.object({
  slug,
  title: text,
  date: z.iso.date(),
  summary: text,
  cover: photo,
  intro: z.object({
    title: text,
    setup: text,
    question: text,
    paragraphs: z.array(text),
    roles: z.array(z.object({ name: text, description: text })),
    rules: text,
  }),
  lineup: z.object({ title: text, paragraphs: z.array(text) }),
  sections: z.array(z.object({
    id: slug,
    role: text,
    title: text,
    paragraphs: z.array(text).min(1),
    photos: z.array(photo),
  })),
  addendum: z.object({ title: text, paragraph: text, photo }),
  friends: z.object({
    title: text,
    lists: z.array(z.object({ name: text, cars: z.array(text) })),
  }),
});

export type BlogArticle = z.infer<typeof post>;
export type BlogPhoto = z.infer<typeof photo>;

export const blogPosts = z.array(post).parse(content).sort((a, b) => b.date.localeCompare(a.date));

export const postPath = (post: BlogArticle) => `/blog/${post.slug}/`;
export const postImagePath = (post: BlogArticle, photo: BlogPhoto) => `/assets/blog/${post.slug}/${photo.file}`;
