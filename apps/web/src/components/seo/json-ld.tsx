import { siteConfig } from "@/lib/site";

/** Render a JSON-LD <script> block. data is trusted (built server-side). */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.svg`,
        email: siteConfig.email,
        description: siteConfig.description,
        sameAs: [
          "https://twitter.com/threadform",
          "https://instagram.com/threadform",
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/templates?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: { "@type": "Answer", text: it.answer },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${siteConfig.url}${it.url}`,
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  priceFrom,
  image,
}: {
  name: string;
  description: string;
  priceFrom: number;
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image: image ? `${siteConfig.url}${image}` : undefined,
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: priceFrom,
          offerCount: 3,
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}
