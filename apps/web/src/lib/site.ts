/**
 * Central site configuration — single source of truth for URLs, nav, and
 * brand metadata used across SEO, navbar, footer, and structured data.
 */

export const siteConfig = {
  name: "ThreadForm",
  legalName: "ThreadForm Technologies",
  tagline: "Design custom apparel your whole crew will wear.",
  description:
    "ThreadForm is India's design-first custom apparel studio. Design t-shirts, hoodies and oversized tees in 3D, share a link, and order solo or in bulk — built for college clubs, fests, events, sports teams, startups and communities.",
  url: "https://threadform.com",
  ogImage: "/og.png",
  locale: "en_IN",
  twitter: "@threadform",
  email: "hello@threadform.com",
  keywords: [
    "custom apparel design",
    "custom t-shirts India",
    "custom hoodies",
    "3D apparel designer",
    "college fest merch",
    "club hoodies",
    "team jerseys",
    "bulk t-shirt printing",
    "design your own t-shirt online",
    "oversized tee designer",
  ],
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "College Clubs", href: "/college-clubs" },
  { label: "College Fests", href: "/college-fests" },
  { label: "Events", href: "/events" },
  { label: "Sports Teams", href: "/sports-teams" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Use cases",
    items: [
      { label: "College Clubs", href: "/college-clubs" },
      { label: "College Fests", href: "/college-fests" },
      { label: "Events", href: "/events" },
      { label: "Sports Teams", href: "/sports-teams" },
    ],
  },
  {
    title: "Product",
    items: [
      { label: "Design Studio", href: "/#how-it-works" },
      { label: "Templates", href: "/#templates" },
      { label: "Bulk Ordering", href: "/#bulk" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "mailto:hello@threadform.com" },
    ],
  },
];

export const STUDIO_URL = "/studio";
