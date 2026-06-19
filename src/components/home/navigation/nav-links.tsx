'use client';

import { usePathname } from 'next/navigation';

const NavLinks = () => {
  const pathname = usePathname();

  const href = (anchor: string) =>
    pathname === '/' ? `#${anchor}` : `/#${anchor}`;

  const routeClass = (path: string) =>
    `text-sm cursor-pointer ${pathname === path
      ? 'font-bold text-white bg-blue-500/20 rounded-lg px-3 py-1'
      : 'hover:text-foreground/80'}`;

  const homeClass =
    `text-sm cursor-pointer ${pathname === '/'
      ? 'font-bold text-white bg-blue-500/20 rounded-lg px-3 py-1'
      : 'hover:text-foreground/80'}`;

  return (
    <ul className="flex items-center justify-center gap-8">
      <a href={href('what-is-nocap')} className={homeClass}>
        What is NoCaps?
      </a>
      <a href="/features" className={routeClass('/features')}>
        Features
      </a>
      <a href={href('about')} className={homeClass}>
        About
      </a>
      <a href={href('feedback')} className={homeClass}>
        Feedback
      </a>
      <a href={href('pricing')} className={homeClass}>
        Pricing
      </a>
      <a href="/release-roadmap" className={routeClass('/release-roadmap')}>
        Release Roadmap
      </a>
      <a href="/tech-demo" className={routeClass('/tech-demo')}>
        Tech Demo
      </a>
    </ul>
  );
};

export default NavLinks; 