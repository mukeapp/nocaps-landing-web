'use client';

const FooterLinks = () => {
  return (
    <div className="flex flex-col gap-4">
      <a 
        href="#features"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Features
      </a>
      <a 
        href="#pricing"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Pricing
      </a>
      <a 
        href="#feedback"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        Testimonials
      </a>
      <a 
        href="#about"
        className="hover:text-foreground/80 text-sm cursor-pointer"
      >
        How it Works
      </a>
    </div>
  );
};

export default FooterLinks; 