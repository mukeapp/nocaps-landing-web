// Functional web Alert.alert — react-native-web ships Alert as a silent no-op,
// which left every confirm dialog in the copied mobile code (drawer logout,
// delete confirmations, ...) dead. Same DOM approach as the toast shim; styled
// after the native alert: centered dark card, title, message, button row.

interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

function alert(title: string, message?: string, buttons?: AlertButton[]) {
  if (typeof document === "undefined") return;

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: "99998",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "0",
    transition: "opacity 0.15s ease",
  } as CSSStyleDeclaration);

  const card = document.createElement("div");
  Object.assign(card.style, {
    backgroundColor: "#2C2C2E",
    borderRadius: "14px",
    minWidth: "270px",
    maxWidth: "320px",
    padding: "20px 20px 12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    transform: "scale(0.96)",
    transition: "transform 0.15s ease",
  } as CSSStyleDeclaration);

  const titleEl = document.createElement("div");
  titleEl.textContent = title ?? "";
  Object.assign(titleEl.style, {
    color: "#F2F2F2",
    fontFamily: "semibold, sans-serif",
    fontSize: "17px",
    textAlign: "center",
  } as CSSStyleDeclaration);
  card.appendChild(titleEl);

  if (message) {
    const msgEl = document.createElement("div");
    msgEl.textContent = message;
    Object.assign(msgEl.style, {
      color: "rgba(242,242,242,0.6)",
      fontFamily: "regular, sans-serif",
      fontSize: "14px",
      textAlign: "center",
      marginTop: "8px",
      lineHeight: "1.4",
    } as CSSStyleDeclaration);
    card.appendChild(msgEl);
  }

  const row = document.createElement("div");
  Object.assign(row.style, {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "18px",
  } as CSSStyleDeclaration);

  const close = () => {
    overlay.style.opacity = "0";
    card.style.transform = "scale(0.96)";
    setTimeout(() => overlay.remove(), 150);
  };

  const list: AlertButton[] = buttons && buttons.length ? buttons : [{ text: "OK" }];
  for (const btn of list) {
    const b = document.createElement("button");
    b.textContent = btn.text ?? "OK";
    const color =
      btn.style === "destructive"
        ? "rgba(235,87,87,1)"
        : btn.style === "cancel"
          ? "rgba(242,242,242,0.55)"
          : "rgba(45,156,219,1)";
    Object.assign(b.style, {
      background: "none",
      border: "none",
      color,
      fontFamily: "semibold, sans-serif",
      fontSize: "15px",
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: "8px",
    } as CSSStyleDeclaration);
    b.addEventListener("click", () => {
      close();
      btn.onPress?.();
    });
    row.appendChild(b);
  }
  card.appendChild(row);
  overlay.appendChild(card);

  // Tapping the dim background cancels (same as Android's cancelable alert).
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
      list.find((b) => b.style === "cancel")?.onPress?.();
    }
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    card.style.transform = "scale(1)";
  });
}

const Alert = { alert };
export default Alert;
