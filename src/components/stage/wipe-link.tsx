"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useStage } from "./stage";

type WipeLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string };

/** `next/link` whose client navigation runs through the stage (and its page wipe). */
export const WipeLink = ({ href, ...rest }: WipeLinkProps) => {
  const { go } = useStage();
  return (
    <Link
      href={href}
      onNavigate={(e) => {
        e.preventDefault();
        go(href);
      }}
      {...rest}
    />
  );
};
