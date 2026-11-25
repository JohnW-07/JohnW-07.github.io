import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WipeLink } from "@/components/stage/wipe-link";
import { blogPosts, postImagePath, postPath, type BlogArticle, type BlogPhoto } from "@/data/blog-posts";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { getBlogPostStructuredData } from "@/utils/seo/structured-data";

type PostPageProps = { params: Promise<{ slug: string }> };

export const postParams = () => blogPosts.map(({ slug }) => ({ slug }));

const findPost = async ({ params }: PostPageProps) => {
  const { slug } = await params;
  return blogPosts.find((post) => post.slug === slug) ?? notFound();
};

export async function postMetadata(props: PostPageProps): Promise<Metadata> {
  const post = await findPost(props);
  const image = postImagePath(post, post.cover);
  const metadata = generateMetadata({
    title: `${post.title} · ${siteConfig.name}`,
    description: post.summary,
    url: postPath(post),
    ogImage: image,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.url],
      images: [{ url: image, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }],
    },
  };
}

function Photo({ post, photo, cover = false }: { post: BlogArticle; photo: BlogPhoto; cover?: boolean }) {
  return (
    <figure className={cover ? "post-cover" : "post-photo"}>
      <Image
        src={postImagePath(post, photo)}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={cover ? "(max-width: 800px) 92vw, 56vw" : "(max-width: 560px) 92vw, 44vw"}
        preload={cover}
      />
      <figcaption>
        <span>{photo.caption}</span>
        <span>
          <a href={photo.source} rel="noopener">{photo.credit}</a>
          {photo.license && <> · <a href={photo.license.url} rel="noopener">{photo.license.name}</a></>}
        </span>
      </figcaption>
    </figure>
  );
}

const formatDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export async function BlogPostView(props: PostPageProps) {
  const post = await findPost(props);
  const { intro, lineup, sections, addendum, friends } = post;
  const jsonLd = getBlogPostStructuredData(post, postPath(post), postImagePath(post, post.cover));

  return (
    <article className="blog-post" aria-labelledby="post-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="post-header">
        <div className="post-heading">
          <WipeLink className="post-back" href="/blog/">All posts</WipeLink>
          <p className="post-byline">{siteConfig.author} <span aria-hidden="true">/</span> <time dateTime={post.date}>{formatDate.format(new Date(post.date))}</time></p>
          <h1 id="post-title">{post.title}</h1>
          <p className="post-deck">{post.summary}</p>
        </div>
        <Photo post={post} photo={post.cover} cover />
      </header>

      <nav className="post-contents" aria-label="In this post">
        <ul>{sections.map((section) => <li key={section.id}><Link href={`#${section.id}`}>{section.role}</Link></li>)}</ul>
      </nav>

      <section className="post-prose" aria-labelledby="garage-rules">
        <h2 id="garage-rules">{intro.title}</h2>
        <p>{intro.setup}</p>
        <blockquote>{intro.question}</blockquote>
        {intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <dl className="post-roles">{intro.roles.map(({ name, description }) => (
          <div key={name}><dt>{name}</dt><dd>{description}</dd></div>
        ))}</dl>
        <p>{intro.rules}</p>
      </section>

      <section aria-labelledby="garage-lineup">
        <header className="post-prose">
          <h2 id="garage-lineup">{lineup.title}</h2>
          {lineup.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </header>
        {sections.map(({ id, role, title, paragraphs: [first, ...rest], photos, source }) => (
          <section className="post-chapter" key={id} id={id} aria-labelledby={`${id}-title`}>
            <header><p className="post-role">{role}</p><h3 id={`${id}-title`}>{title}</h3></header>
            <div className="post-prose"><p>{first}</p></div>
            <div className="post-photos">{photos.map((photo) => <Photo key={photo.file} post={post} photo={photo} />)}</div>
            <div className="post-prose">
              {rest.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {source && <p className="post-reference"><a href={source.url} rel="noopener">{source.name}</a></p>}
            </div>
          </section>
        ))}
      </section>

      <section className="post-addendum" aria-labelledby="one-car">
        <div className="post-prose"><h2 id="one-car">{addendum.title}</h2><p>{addendum.paragraph}</p></div>
        <Photo post={post} photo={addendum.photo} />
      </section>

      <section className="post-friends" aria-labelledby="other-garages">
        <h2 id="other-garages">{friends.title}</h2>
        <div className="post-friend-lists">{friends.lists.map(({ name, cars }) => (
          <div key={name}><h3>{name}</h3><ol>{cars.map((car) => <li key={car}>{car}</li>)}</ol></div>
        ))}</div>
      </section>

      <footer className="post-footer"><WipeLink className="post-back" href="/blog/">All posts</WipeLink></footer>
    </article>
  );
}
