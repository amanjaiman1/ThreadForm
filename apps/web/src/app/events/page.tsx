import type { Metadata } from "next";
import { UseCasePage } from "@/components/templates/use-case-page";
import { useCases } from "@/lib/use-cases";

const data = useCases["events"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
  openGraph: {
    title: `${data.metaTitle} · ThreadForm`,
    description: data.metaDescription,
    url: `/${data.slug}`,
  },
};

export default function Page() {
  return <UseCasePage data={data} />;
}
