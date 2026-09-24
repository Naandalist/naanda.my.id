import { GitHubIcon, LinkedInIcon } from "@/components/sites/un.ms-9e73fc9e/pile-7b2b2b3f/icons";
import { siteConfig } from "@/lib/site-config";

const icons = { LinkedIn: LinkedInIcon, GitHub: GitHubIcon };

export function SocialLinks() {
  return <nav className="hero-social-links" aria-label="Social profiles">{siteConfig.socialLinks.map(({ label, href }) => {
    const Icon = icons[label];
    return <a key={label} href={href} target="_blank" rel="noopener noreferrer"><Icon />{label}</a>;
  })}</nav>;
}
