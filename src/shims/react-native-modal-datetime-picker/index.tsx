"use client";

import React, { useEffect, useRef } from "react";

// DateTimePickerModal → native browser picker in a dark modal, same props
// (isVisible, mode, date, onConfirm, onCancel).
export default function DateTimePickerModal({
  isVisible,
  mode = "date",
  date,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.showPicker?.();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const type = mode === "time" ? "time" : mode === "datetime" ? "datetime-local" : "date";

  const toInputValue = (d?: Date) => {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    if (type === "time") return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const day = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (type === "date") return day;
    return `${day}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleConfirm = () => {
    const v = inputRef.current?.value;
    if (!v) {
      onCancel?.();
      return;
    }
    let result: Date;
    if (type === "time") {
      const [h, m] = v.split(":").map(Number);
      result = new Date(date ?? Date.now());
      result.setHours(h, m, 0, 0);
    } else {
      result = new Date(v);
    }
    onConfirm?.(result);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onCancel?.()}
    >
      <div
        style={{
          backgroundColor: "#2C2C2E",
          borderRadius: 12,
          padding: 20,
          minWidth: 280,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type={type}
          defaultValue={toInputValue(date)}
          min={minimumDate ? toInputValue(minimumDate) : undefined}
          max={maximumDate ? toInputValue(maximumDate) : undefined}
          style={{
            backgroundColor: "rgba(41,41,41,1)",
            border: "1px solid #3A3A3A",
            borderRadius: 8,
            color: "#F2F2F2",
            padding: "10px 12px",
            fontSize: 16,
            colorScheme: "dark",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
          <button
            onClick={() => onCancel?.()}
            style={{ background: "none", border: "none", color: "rgba(242,242,242,0.5)", fontSize: 15, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{ background: "none", border: "none", color: "rgba(45,156,219,1)", fontSize: 15, cursor: "pointer" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
