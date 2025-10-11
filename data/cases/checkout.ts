// data/cases/checkout.ts
export const CASE_CHECKOUT = {
  id: "checkout",
  title: "Checkout Flow Optimization",
  client: "E-commerce Platform",
  year: "2022-2023",
  role: "Senior Product Designer",
  keywords: ["checkout", "conversion", "e-commerce", "payment", "drop-off", "optimization", "forms", "cart"],
  
  challenge:
    "Checkout abandonment rate was 68%, well above industry average. Users cited confusion, too many steps, and payment friction as key blockers.",
  
  approach: [
    "Analyzed funnel data and conducted exit surveys to identify drop-off points",
    "Simplified from 5 steps to 3 steps (cart → details → payment)",
    "Implemented guest checkout option (previously required account creation)",
    "Added real-time validation and clear error messaging for form fields",
    "Designed trust signals: security badges, shipping estimates, and progress indicators",
    "A/B tested variations with 10K+ users before full rollout"
  ],
  
  outcome: [
    "Reduced checkout abandonment from 68% to 41% (40% improvement)",
    "Increased completed transactions by 31% month-over-month",
    "Guest checkout adopted by 52% of new customers",
    "Mobile checkout completion improved by 47%",
    "Estimated $2.1M additional annual revenue"
  ],
  
  tools: ["Figma", "Amplitude", "Hotjar", "Optimal Workshop", "Next.js", "Stripe API"],
  
  links: {
    portfolio: "https://www.david.black/work/checkout",
    caseStudy: "https://www.david.black/blog/checkout-optimization"
  },
  
  highlights: [
    "Led cross-functional workshop with product, engineering, and marketing",
    "Created reusable form patterns for checkout that were adopted across 3 other flows",
    "Presented results at company all-hands and design conference"
  ]
};

