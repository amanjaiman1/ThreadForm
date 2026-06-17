import type { Faq } from "./content";

export type UseCaseBenefit = { title: string; body: string };

export type UseCase = {
  slug: string;
  nav: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  highlight: string;
  titleTail: string;
  description: string;
  ctaTitle: string;
  ctaSubtitle: string;
  benefits: UseCaseBenefit[];
  showcase: { title: string; sub: string; garment: string; accent: string }[];
  faqs: Faq[];
};

export const useCases: Record<string, UseCase> = {
  "college-clubs": {
    slug: "college-clubs",
    nav: "College Clubs",
    metaTitle: "Custom Apparel for College Clubs",
    metaDescription:
      "Design and order custom club hoodies, tees and merch online. ThreadForm makes branded apparel for college clubs and societies easy — 3D preview, shared links and group ordering.",
    eyebrow: "For College Clubs",
    title: "Merch that makes your club",
    highlight: "impossible to ignore",
    titleTail: "",
    description:
      "From recruitment drives to farewell drops — design club hoodies and tees in minutes, share one link, and let every member order their own size.",
    ctaTitle: "Give your club the merch it deserves",
    ctaSubtitle:
      "Design free, preview in 3D, and collect orders from every member with a single link.",
    benefits: [
      {
        title: "On-brand, every time",
        body: "Save your club logo, colors and fonts as a brand kit so every drop looks unmistakably yours.",
      },
      {
        title: "No more size spreadsheets",
        body: "Share a link; members pick their size and pay their share. You just hit order.",
      },
      {
        title: "Budget-friendly bulk",
        body: "Prices drop automatically as more members join — great for tight club budgets.",
      },
      {
        title: "Recruit with style",
        body: "Stand out at orientation with merch that makes freshers want to join your club.",
      },
    ],
    showcase: [
      { title: "RC", sub: "Design Club", garment: "#2A1170", accent: "#FFFFFF" },
      { title: "DEBSOC", sub: "Debate Society", garment: "#1A1A1A", accent: "#A6F000" },
      { title: "MUSIC", sub: "Club Hoodie", garment: "#0B3D2E", accent: "#A6F000" },
    ],
    faqs: [
      {
        question: "Can every member order their own size?",
        answer:
          "Yes. Share the group link and each member selects their size and pays their share — no collecting cash or maintaining a spreadsheet.",
      },
      {
        question: "Can we reuse our club branding?",
        answer:
          "Save a brand kit with your logo, colors and fonts once, then reuse it across every design and every semester.",
      },
      {
        question: "Is there a minimum number of members?",
        answer:
          "No minimum. Order for a 5-person core team or a 200-member club — bulk pricing scales automatically.",
      },
    ],
  },

  "college-fests": {
    slug: "college-fests",
    nav: "College Fests",
    metaTitle: "Custom Fest Merch & Crew Apparel",
    metaDescription:
      "Design custom fest t-shirts and crew hoodies online. ThreadForm helps college fests create standout merch with 3D previews, bulk pricing and easy group ordering.",
    eyebrow: "For College Fests",
    title: "Fest merch that sells out",
    highlight: "before the fest does",
    titleTail: "",
    description:
      "Crew tees, organizer hoodies, and sellable fest merch — designed fast, previewed in 3D, and produced in bulk to hit your event date.",
    ctaTitle: "Make this year's fest merch legendary",
    ctaSubtitle:
      "Design your fest drop free, preview in 3D, and order in bulk in time for the big day.",
    benefits: [
      {
        title: "Crew + sellable merch",
        body: "Design organizer hoodies and attendee tees in one place — two drops, one studio.",
      },
      {
        title: "Hit your event date",
        body: "Clear production timelines and tracked shipping so your merch lands before day one.",
      },
      {
        title: "Volume pricing",
        body: "The bigger the fest, the better the per-unit price. Perfect for hundreds of pieces.",
      },
      {
        title: "Sponsor-ready",
        body: "Add sponsor logos to the back or sleeve and keep everyone happy.",
      },
    ],
    showcase: [
      { title: "SPRING", sub: "Fest '26", garment: "#1A1A1A", accent: "#A6F000" },
      { title: "CREW", sub: "Organizer Tee", garment: "#6C3CE9", accent: "#FFFFFF" },
      { title: "VIBE", sub: "Fest Hoodie", garment: "#0E0E12", accent: "#2F77F0" },
    ],
    faqs: [
      {
        question: "Can we produce hundreds of pieces in time?",
        answer:
          "Yes — bulk orders are produced and shipped within 7–10 days on average. Start early and you'll have merch well before your fest.",
      },
      {
        question: "Can we add sponsor logos?",
        answer:
          "Absolutely. Use the back and sleeve print areas for sponsor branding while keeping your fest identity on the front.",
      },
      {
        question: "Can we sell the merch to attendees?",
        answer:
          "Many fests design a sellable line and an organizer-only crew line. Design both and order the quantities you need.",
      },
    ],
  },

  events: {
    slug: "events",
    nav: "Events",
    metaTitle: "Custom Apparel for Events & Conferences",
    metaDescription:
      "Custom event t-shirts, hackathon hoodies and conference merch. Design online in 3D, share with your team, and order in bulk with ThreadForm.",
    eyebrow: "For Events",
    title: "Branded apparel for events",
    highlight: "people actually keep",
    titleTail: "",
    description:
      "Hackathons, conferences, meetups and launches — create memorable event merch that doubles as walking advertising.",
    ctaTitle: "Turn your event into merch people wear for years",
    ctaSubtitle:
      "Design free, preview in 3D, and order volunteer and attendee apparel in bulk.",
    benefits: [
      {
        title: "Volunteers & attendees",
        body: "Distinct designs for staff, speakers and attendees — all from one shared project.",
      },
      {
        title: "Tight timelines, handled",
        body: "Predictable production and tracked delivery so merch arrives before doors open.",
      },
      {
        title: "Walking advertising",
        body: "Great event tees get worn long after — free brand exposure for months.",
      },
      {
        title: "Multi-sponsor friendly",
        body: "Place multiple sponsor marks cleanly across front, back and sleeves.",
      },
    ],
    showcase: [
      { title: "HACK", sub: "Night Hoodie", garment: "#14171F", accent: "#2F77F0" },
      { title: "DEVCON", sub: "Attendee Tee", garment: "#0E0E12", accent: "#A6F000" },
      { title: "STAFF", sub: "Crew Tee", garment: "#6C3CE9", accent: "#FFFFFF" },
    ],
    faqs: [
      {
        question: "Can we order different designs for staff and attendees?",
        answer:
          "Yes. Create separate designs for volunteers, speakers and attendees, and order the right quantity for each.",
      },
      {
        question: "Will merch arrive before our event?",
        answer:
          "Most bulk orders ship within 7–10 days with a tracked timeline. Plan ahead and you're covered.",
      },
      {
        question: "Can we include multiple sponsor logos?",
        answer:
          "Use front, back and sleeve print areas to feature multiple sponsors while keeping the design clean.",
      },
    ],
  },

  "sports-teams": {
    slug: "sports-teams",
    nav: "Sports Teams",
    metaTitle: "Custom Sports Jerseys & Team Kits",
    metaDescription:
      "Design custom team jerseys with names and numbers. ThreadForm makes personalized sports kits easy — 3D preview, roster personalization and bulk ordering.",
    eyebrow: "For Sports Teams",
    title: "Pro-looking kits",
    highlight: "at a student budget",
    titleTail: "",
    description:
      "Numbered, named jerseys for the whole squad — generated automatically from your roster, previewed in 3D, and delivered as a matching set.",
    ctaTitle: "Kit out your squad like the pros",
    ctaSubtitle:
      "Add names and numbers per player, preview in 3D, and order the full set in one go.",
    benefits: [
      {
        title: "Names & numbers",
        body: "Personalize every jersey from your roster — names and numbers generated automatically.",
      },
      {
        title: "Matching team set",
        body: "Consistent colors and branding across the whole squad, delivered together.",
      },
      {
        title: "Roster made simple",
        body: "Each player picks their size and personalization from one shared link.",
      },
      {
        title: "Looks pro, costs less",
        body: "Stadium-grade looks without the custom-kit price tag — bulk pricing built in.",
      },
    ],
    showcase: [
      { title: "10", sub: "Titans FC", garment: "#0B3D2E", accent: "#A6F000" },
      { title: "07", sub: "Riverside", garment: "#1A1A1A", accent: "#FFFFFF" },
      { title: "23", sub: "Campus Cup", garment: "#2A1170", accent: "#A6F000" },
    ],
    faqs: [
      {
        question: "Can each jersey have a different name and number?",
        answer:
          "Yes. Turn on personalization and every player adds their own name and number — we generate a print-ready variant for each.",
      },
      {
        question: "Will the whole set match?",
        answer:
          "All jerseys share the same base design and colors, so your squad looks like one unified team.",
      },
      {
        question: "How do players submit their details?",
        answer:
          "Share the team link; each player picks their size and enters their name and number. You review and order the full set.",
      },
    ],
  },
};

export const useCaseSlugs = Object.keys(useCases);
