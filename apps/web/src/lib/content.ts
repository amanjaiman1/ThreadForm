/** Marketing content — centralized so pages and sections stay consistent. */

export type Step = { n: string; title: string; body: string };
export const steps: Step[] = [
  {
    n: "01",
    title: "Pick a blank",
    body: "Start from a t-shirt, hoodie or oversized tee — or a ready-made template built for your vibe.",
  },
  {
    n: "02",
    title: "Make it yours",
    body: "Drop in text, upload your logo or art, recolor the garment, and arrange it all on a live print area.",
  },
  {
    n: "03",
    title: "Preview in 3D",
    body: "Spin the garment, switch colors, and see exactly what lands at your door before you pay a rupee.",
  },
  {
    n: "04",
    title: "Share & order",
    body: "Send a link, collect sizes and payments from your whole crew, then order solo or in bulk.",
  },
];

export type Feature = {
  title: string;
  body: string;
  icon: "cube" | "type" | "image" | "share" | "layers" | "truck";
};
export const features: Feature[] = [
  {
    title: "Real-time 3D preview",
    body: "Every edit maps onto a true-to-life garment. What you see is what gets printed.",
    icon: "cube",
  },
  {
    title: "Text, logos & uploads",
    body: "Curated print fonts, your club logo, or any image — with live print-safety checks.",
    icon: "type",
  },
  {
    title: "Brand kits",
    body: "Save your colors, fonts and logos once. Stay on-brand across every drop.",
    icon: "image",
  },
  {
    title: "Share a design link",
    body: "Anyone can view, react and order from a single link — no account needed.",
    icon: "share",
  },
  {
    title: "Layers & full control",
    body: "Arrange front, back and sleeves with snapping, layers and undo — Figma-style.",
    icon: "layers",
  },
  {
    title: "Doorstep delivery",
    body: "Vetted print partners, tracked shipping, and a sub-2% defect promise.",
    icon: "truck",
  },
];

export type TemplateCard = {
  title: string;
  category: string;
  garment: string;
  accent: string;
};
export const templates: TemplateCard[] = [
  { title: "Fest Crew Hoodie", category: "College Fest", garment: "#1A1A1A", accent: "#A6F000" },
  { title: "Club Monogram Tee", category: "College Club", garment: "#2A1170", accent: "#FFFFFF" },
  { title: "Titans Jersey", category: "Sports Team", garment: "#0B3D2E", accent: "#A6F000" },
  { title: "Launch Day Tee", category: "Startup", garment: "#0E0E12", accent: "#A6F000" },
  { title: "Reunion Oversized", category: "Community", garment: "#6C3CE9", accent: "#FFFFFF" },
  { title: "Hack Night Hoodie", category: "Event", garment: "#14171F", accent: "#2F77F0" },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};
export const testimonials: Testimonial[] = [
  {
    quote:
      "We kitted out 60 people for our fest in a weekend. The share link did all the size-collecting for me — zero spreadsheets.",
    name: "Ria Sharma",
    role: "Cultural Secretary, Riverside College",
    initials: "RS",
  },
  {
    quote:
      "The 3D preview sold it. Our committee approved the design in one call because everyone could actually see it.",
    name: "Arjun Mehta",
    role: "Club Lead, Coding Society",
    initials: "AM",
  },
  {
    quote:
      "Numbered, named jerseys for all 22 players generated automatically. It felt like a pro kit, at a student budget.",
    name: "Coach Meera Nair",
    role: "Team Manager, Titans FC",
    initials: "MN",
  },
  {
    quote:
      "We reorder team swag every time we hire. Brand kit keeps it perfectly on-brand without me lifting a finger.",
    name: "Dev Patel",
    role: "Founder, Stackbird",
    initials: "DP",
  },
];

export type Faq = { question: string; answer: string };
export const faqs: Faq[] = [
  {
    question: "Is ThreadForm free to use?",
    answer:
      "Yes. Designing, previewing in 3D, saving and sharing are completely free. You only pay when you order apparel — solo or in bulk.",
  },
  {
    question: "Is there a minimum order quantity?",
    answer:
      "No minimum to start — order a single piece if you like. Bulk pricing kicks in automatically as your quantity grows, so groups save more.",
  },
  {
    question: "How does group ordering and payment work?",
    answer:
      "Start a group order and share the join link. Members pick their size (and name/number for jerseys) and can pay their own share, or you can cover the whole order. We handle the collection.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are produced and shipped within 7–10 days. You'll get a tracked timeline from payment to your doorstep, and we hold a sub-2% defect rate.",
  },
  {
    question: "Can I use my own logo and fonts?",
    answer:
      "Absolutely. Upload your logo or artwork and we run an automatic print-safety check (resolution/DPI) so it looks crisp on fabric. Pro brand kits let you reuse them everywhere.",
  },
  {
    question: "What can I design on?",
    answer:
      "T-shirts, hoodies and oversized tees today, with front, back and sleeve print areas. More garments are on the way.",
  },
];

export const stats = [
  { value: "120k+", label: "Pieces shipped" },
  { value: "2,300+", label: "Crews & clubs" },
  { value: "4.9/5", label: "Average rating" },
  { value: "<2%", label: "Defect rate" },
];
