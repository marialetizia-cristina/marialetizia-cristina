import { useEffect, useRef, useState } from "react";
import "../style/CustomCursor.css";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, summary, label";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const interactiveRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches || prefersReducedMotion.matches) {
      return;
    }

    setIsEnabled(true);
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);

      const target = event.target as HTMLElement | null;
      const nextInteractive = Boolean(target && target.closest(INTERACTIVE_SELECTOR));
      if (interactiveRef.current !== nextInteractive) {
        interactiveRef.current = nextInteractive;
        setIsInteractive(nextInteractive);
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        setIsVisible(false);
        setIsPressed(false);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        setIsVisible(false);
        setIsPressed(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  const classes = [
    "custom-cursor",
    isVisible ? "is-visible" : "",
    isPressed ? "is-active" : "",
    isInteractive ? "is-interactive" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <span className="custom-cursor__ring" />
    </span>
  );
};

export default CustomCursor;
