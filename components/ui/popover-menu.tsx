"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type MenuPos = {
  top: number;
  left: number;
  width: number;
  side: "top" | "bottom";
};

export function PopoverMenu(props: {
  align?: "left" | "right";
  side?: "top" | "bottom" | "auto";
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const preferredSide = props.side ?? "auto";

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }

    function updatePosition() {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const menuHeight = menu?.offsetHeight ?? 180;
      const menuWidth = Math.max(menu?.offsetWidth ?? 220, rect.width);
      const gap = 8;
      const padding = 12;

      const spaceBelow = window.innerHeight - rect.bottom - padding;
      const spaceAbove = rect.top - padding;

      let side: "top" | "bottom" = "bottom";
      if (preferredSide === "top") side = "top";
      else if (preferredSide === "bottom") side = "bottom";
      else if (spaceBelow < menuHeight && spaceAbove > spaceBelow) side = "top";

      let top =
        side === "bottom" ? rect.bottom + gap : rect.top - gap - menuHeight;
      top = Math.max(padding, Math.min(top, window.innerHeight - menuHeight - padding));

      let left =
        props.align === "right" ? rect.right - menuWidth : rect.left;
      left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));

      setPos({ top, left, width: menuWidth, side });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, preferredSide, props.align]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", props.className)}>
      <div
        ref={triggerRef}
        className={cn("inline-flex", props.className?.includes("w-full") && "w-full")}
        onClick={() => setOpen((value) => !value)}
      >
        {props.trigger}
      </div>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className="fixed z-[80] min-w-[240px] overflow-visible rounded-card border border-stone bg-paper py-1.5 shadow-lift"
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: pos?.width,
              visibility: pos ? "visible" : "hidden"
            }}
            onClick={() => setOpen(false)}
          >
            {props.children}
          </div>,
          document.body
        )}
    </div>
  );
}
