import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  as?: ElementType;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

export default function Reveal({ as: Tag = "div", delay = 0, className = "", children }: RevealProps) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
