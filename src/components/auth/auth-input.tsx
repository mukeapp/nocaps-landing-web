"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

/**
 * Mirrors mobile's shared auth inputRow (Signin/SignUp/RecoverPassword):
 * 46px row, #191919 fill, 1px #3A3A3A border, 8px radius, leading icon,
 * 12px off-white text, 50%-white placeholder, optional eye toggle.
 */
export function AuthInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  withPasswordToggle = false,
}: {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  withPasswordToggle?: boolean;
}) {
  const [show, setShow] = useState(false);
  const effectiveType = withPasswordToggle ? (show ? "text" : "password") : type;

  return (
    <div className="mb-3 flex h-[46px] w-full items-center justify-between rounded-lg border border-[#3A3A3A] bg-[rgba(25,25,25,1)] px-3">
      <Icon className="h-[18px] w-[18px] shrink-0 text-[#F2F2F2]" />
      <input
        type={effectiveType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="mx-2 min-w-0 flex-1 bg-transparent text-[12px] text-[#F2F2F2] outline-none placeholder:text-[rgba(242,242,242,0.5)]"
      />
      {withPasswordToggle ? (
        <button type="button" onClick={() => setShow((v) => !v)} className="shrink-0 text-[#F2F2F2]">
          {show ? <Eye className="h-[18px] w-[18px]" /> : <EyeOff className="h-[18px] w-[18px]" />}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Mirrors mobile's ButtonSignIn defaults: white pill, black bold 16px
 * letter-spaced text, ~90% width centered, ~50px tall, 12px radius.
 */
export function AuthButton({
  children,
  onClick,
  type = "button",
  disabled,
  dark = false,
  widthClass = "w-[90%]",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  dark?: boolean;
  widthClass?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`mx-auto block h-[50px] ${widthClass} rounded-xl text-[16px] font-bold tracking-wider disabled:opacity-60 ${
        dark ? "bg-[rgba(28,28,28,1)] text-white" : "bg-[#F2F2F2] text-black"
      }`}
    >
      {children}
    </button>
  );
}
