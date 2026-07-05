import Image from "next/image";

// Mirrors the exact header row inside mobile's CustomDrawerContent: a
// title_background-colored box holding the logo, plus bold white "NoCaps" text.
export function DrawerLogo() {
  return (
    <div className="mb-4 flex items-center gap-3 px-1 py-2">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#252525]">
        <Image src="/assets/images/logo.png" alt="NoCaps" width={28} height={28} />
      </div>
      <span className="text-lg font-bold text-white">NoCaps</span>
    </div>
  );
}
