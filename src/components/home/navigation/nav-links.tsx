'use client';

const NavLinks = () => {
  return (
    <ul className="flex items-center justify-center gap-8">
      <a 
        href="#pricing"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Pricing
      </a>
      <a 
        href="#about"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        About
      </a>
      <a 
        href="#features"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Features
      </a>
      <a 
        href="#feedback"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Feedback
      </a>
    </ul>
  );
};

export default NavLinks; 