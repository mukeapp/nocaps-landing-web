"use client";

// Web clone of react-native-root-toast's Toast.show API — same defaults:
// dark translucent pill, white text, fade in/out, bottom position.

interface ToastOptions {
  duration?: number;
  position?: number;
  backgroundColor?: string;
  textColor?: string;
  shadow?: boolean;
  animation?: boolean;
  hideOnPress?: boolean;
  delay?: number;
  opacity?: number;
}

const durations = { LONG: 3500, SHORT: 2000 };
const positions = { TOP: 40, BOTTOM: -20, CENTER: 0 };

function show(message: string, options: ToastOptions = {}) {
  if (typeof document === "undefined") return null;

  const {
    duration = durations.SHORT,
    position = positions.BOTTOM,
    backgroundColor = "rgba(0,0,0,0.8)",
    textColor = "#fff",
    opacity = 1,
    hideOnPress = true,
  } = options;

  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    maxWidth: "80%",
    padding: "10px 16px",
    borderRadius: "5px",
    backgroundColor,
    color: textColor,
    fontSize: "14px",
    fontFamily: "regular, sans-serif",
    zIndex: "99999",
    opacity: "0",
    transition: "opacity 0.2s ease",
    textAlign: "center",
    pointerEvents: hideOnPress ? "auto" : "none",
  } as CSSStyleDeclaration);

  if (position < 0) {
    el.style.bottom = `${Math.abs(position) + 40}px`;
  } else if (position > 0) {
    el.style.top = `${position}px`;
  } else {
    el.style.top = "50%";
    el.style.transform = "translate(-50%, -50%)";
  }

  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = String(opacity);
  });

  const destroy = () => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  };

  const timer = setTimeout(destroy, duration);
  if (hideOnPress) {
    el.addEventListener("click", () => {
      clearTimeout(timer);
      destroy();
    });
  }

  return { destroy };
}

function hide(toast: { destroy: () => void } | null) {
  toast?.destroy();
}

const Toast = { show, hide, durations, positions };
export default Toast;
export { durations, positions };
