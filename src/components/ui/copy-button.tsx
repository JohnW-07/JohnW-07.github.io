"use client";

import { useState } from "react";

export interface CopyLabels {
  readonly idle: string;
  readonly done: string;
  /** Shown when the clipboard is refused, e.g. an insecure origin. */
  readonly fail: string;
}

/** Copies `text` to the clipboard and reports the outcome in its own label. */
export const CopyButton = ({ text, labels }: { text: string; labels: CopyLabels }) => {
  const [state, setState] = useState<keyof CopyLabels>("idle");
  const copy = () =>
    navigator.clipboard.writeText(text).then(
      () => setState("done"),
      () => setState("fail"),
    );

  return (
    <button type="button" data-copy data-c="acc" onClick={copy}>
      {labels[state]}
    </button>
  );
};
