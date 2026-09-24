import { GitHubIcon, LinkedInIcon } from "@/components/hero/social-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/lib/site-config";

const icons = { LinkedIn: LinkedInIcon, GitHub: GitHubIcon };

export function SocialLinks() {
  return (
    <nav className="hero-social-links" aria-label="Social profiles">
      {siteConfig.socialLinks.map(({ label, href }) => {
        const Icon = icons[label];

        return (
          <ButtonLink key={label} href={href} external>
            <Icon />
            {label}
          </ButtonLink>
        );
      })}
    </nav>
  );
}
