import type { Education, Link } from './types';

export const profile = {
  name: 'Daniel Kong',
  location: 'San Diego, CA',
  email: 'dskong07@gmail.com',
  phone: '+1 (248) 759-0132',
  phoneHref: '+12487590132',

  /** Two tracks, stated in one breath. Replaces the old rotating job-title reel. */
  headline: ['Data science', 'and the software', 'it ships inside.'],

  standfirst:
    'I started in data science: statistics, machine learning, and the pipelines that feed them. I moved into full-stack engineering because a model nobody can use is just a notebook. Both tracks run in parallel, and this site is one of them.',

  tracks: {
    ds: {
      id: 'ds' as const,
      label: 'Data Science & ML',
      kicker: 'Track 01 — where I started',
      summary:
        'Geospatial and time-series analysis, computer vision, ETL at terabyte scale, and statistical inference used to make an actual decision.',
      years: 'since 2023',
    },
    swe: {
      id: 'swe' as const,
      label: 'Software Engineering',
      kicker: 'Track 02 — where I build',
      summary:
        'Production web apps and integration backends: TypeScript and React on the front, Postgres and Java services behind, shipped to real users under real compliance rules.',
      years: 'since 2025',
    },
  },

  about: [
    'I graduated from UC San Diego in March 2025 with a B.S. in Data Science. Between coursework I was a data science fellow at San Diego Gas & Electric, built an ETL pipeline over two terabytes of video at HKUST, and ran analytics for a startup going international.',
    'Since then I have been writing software full time. At Civicom I lead REST API and EMR integration work for healthcare check-in software, which means Java services, HIPAA constraints, and integrations that sales depends on. On the side I co-founded Ledger, a personal finance app on Next.js and Supabase with bank sync, encryption at rest, and household sharing.',
    'The through line is that I like the whole path: get the data, model it honestly, then build the thing that puts it in front of someone.',
  ],

  contactNote:
    'Open to interesting engineering and data work. Email is fastest, and I read everything that is not a recruiter template.',

  links: [
    { label: 'Email', href: 'mailto:dskong07@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/dskong07' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/dskong07' },
  ] satisfies Link[],
} as const;

export const education: Education = {
  school: 'University of California, San Diego',
  degree: 'B.S. Data Science',
  location: 'La Jolla, CA',
  graduated: 'March 2025',
  gpa: '3.5 / 4.0',
  gpaNote: 'upper division',
  coursework: [
    'Systems for Scalable Analytics',
    'Data Management',
    'Data Analysis and Inference',
    'Statistical Methods',
    'Probabilistic Modeling and Machine Learning',
    'Data Visualization',
    'Web Mining and Recommender Systems',
    'Data Structures and Algorithms',
  ],
};
