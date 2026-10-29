import type { Metadata } from "next";

import { contactMetadata } from "@/views/contact/metadata";
import { ContactView } from "@/views/contact";

export const metadata: Metadata = contactMetadata();

export default function Page() {
  return <ContactView />;
}
