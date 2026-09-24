export const siteConfig = {
  name: "Naanda",
  description: "A personal page. This sentence is a placeholder.",
  assets: { basePath: "/sites/un.ms-9e73fc9e/pile-7b2b2b3f" },
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
} as const;

export const heroConfig = {
  loopFadeSeconds: 0.6,
  skeletonCapMs: 2_500,
  videoFallbackMs: 60_000,
} as const;
