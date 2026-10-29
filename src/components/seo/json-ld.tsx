/** Emits one JSON-LD node. `data` is built by `@/utils/seo/structured-data`, never from user input. */
export const JsonLd = ({ data }: { data: object }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);
