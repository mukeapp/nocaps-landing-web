'use client';

import { usePathname } from 'next/navigation';

const NavLinks = () => {
  const pathname = usePathname();

  const href = (anchor: string) =>
    pathname === '/' ? `#${anchor}` : `/#${anchor}`;

  return (
    <ul className="flex items-center justify-center gap-8">
      <a href={href('what-is-nocap')} className="hover:text-foreground/80 text-sm cursor-pointer">
        What is NoCaps?
      </a>
      <a href="/features" className="hover:text-foreground/80 text-sm cursor-pointer">
        Features
      </a>
      <a href={href('about')} className="hover:text-foreground/80 text-sm cursor-pointer">
        About
      </a>
      <a href={href('feedback')} className="hover:text-foreground/80 text-sm cursor-pointer">
        Feedback
      </a>
      <a href={href('pricing')} className="hover:text-foreground/80 text-sm cursor-pointer">
        Pricing
      </a>
      <a href="/release-roadmap" className="hover:text-foreground/80 text-sm cursor-pointer">
        Release Roadmap
      </a>
      <a href="/tech-demo" className="hover:text-foreground/80 text-sm cursor-pointer">
        Tech Demo
      </a>
    </ul>
  );
};

export default NavLinks; 