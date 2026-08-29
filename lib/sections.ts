export type SectionMeta = { id: string; label: string };

/** Single source of truth for anchor order and labels. `home` stays in the
 *  list so scroll-spy tracks the hero (otherwise "Work" reads active at the
 *  top), but it's excluded from the rendered nav/footer links — the logo is
 *  the home affordance. */
export const SECTIONS: SectionMeta[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id);

/** The subset shown as nav/footer links — everything except Home. */
export const NAV_SECTIONS: SectionMeta[] = SECTIONS.filter((s) => s.id !== 'home');
