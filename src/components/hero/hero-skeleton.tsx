type HeroSkeletonProps = { fading: boolean };

export function HeroSkeleton({ fading }: HeroSkeletonProps) {
  return <div className={`hero-skeleton ${fading ? "pointer-events-none opacity-0" : "opacity-100"}`} aria-hidden="true"><div className="hero-skeleton__content"><div className="hero-skeleton__logo" /><div className="hero-skeleton__title" /><div className="hero-skeleton__line hero-skeleton__line--wide" /><div className="hero-skeleton__line hero-skeleton__line--short" /><div className="hero-skeleton__links"><div /><div /></div></div></div>;
}
