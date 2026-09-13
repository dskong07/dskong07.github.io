import type { TrackId } from '../styles/tokens';

export type { TrackId };

export interface Link {
  label: string;
  href: string;
}

export interface Role {
  id: string;
  title: string;
  org: string;
  orgNote?: string;
  location: string;
  start: string;
  end: string;
  /** Sort key: ISO year-month of the start date. */
  since: string;
  current: boolean;
  track: TrackId;
  summary: string;
  points: string[];
  stack: string[];
  metric?: { value: string; label: string };
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  graduated: string;
  gpa: string;
  gpaNote: string;
  coursework: string[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectSection {
  heading: string;
  body: string[];
}

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  category: string;
  track: Exclude<TrackId, 'both'>;
  dateLabel: string;
  /** Sort key, newest first. */
  sortDate: string;
  role: string;
  team?: string[];
  partners?: string[];
  stack: string[];
  highlights: { value: string; label: string }[];
  links: Link[];
  /** Omitted when the work has nothing publishable to show. */
  cover?: ProjectImage;
  images: ProjectImage[];
  sections: ProjectSection[];
  featured: boolean;
}

export interface SkillGroup {
  id: string;
  label: string;
  track: TrackId;
  items: string[];
}
