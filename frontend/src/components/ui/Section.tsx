import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  title: string;
  /** Small numbered label above the title. */
  eyebrow?: string;
  /** Right-hand slot in the header, e.g. the admin "Add" button. */
  action?: ReactNode;
  children: ReactNode;
}

export default function Section({ id, title, eyebrow, action, children }: SectionProps) {
  return (
    <section id={id} className="py-16 md:py-28">
      <div className="container-x">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <span className="mb-1 block text-sm font-bold tracking-[0.15em] text-accent2">{eyebrow}</span>}
            <h2 className="text-3xl font-extrabold md:text-5xl">{title}</h2>
          </div>
          {action}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
