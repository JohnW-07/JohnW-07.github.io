import { Fragment } from "react";

/** Headline text split into word spans, so the field can knock out each word (R14 `words`). */
export const Words = ({ text }: { text: string }) =>
  text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span data-c="mid">{w}</span>
    </Fragment>
  ));
