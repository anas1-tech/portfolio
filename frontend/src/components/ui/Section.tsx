import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  /** Next to the title, e.g. the admin "Add" button. */
  action?: ReactNode;
  /** Background field for the whole section, e.g. "bg-bg2". */
  className?: string;
  children: ReactNode;
}

export default function Section({ id, title, action, className = "", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 md:py-40 ${className}`}>
      <div className="container-x">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-20" data-reveal>
          <h2 id={`${id}-title`} className="h-section">
            {title}
          </h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
