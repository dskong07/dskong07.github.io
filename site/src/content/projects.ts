import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'ledger',
    title: 'Ledger',
    shortTitle: 'Ledger',
    tagline:
      'A subscription personal finance platform with bank sync, encryption at rest, and household sharing.',
    category: 'Product — co-founded, in production',
    track: 'swe',
    dateLabel: 'Aug 2026 — ongoing',
    sortDate: '2026-08',
    role: 'Co-founder, full-stack engineer',
    stack: [
      'Next.js 16 App Router',
      'TypeScript',
      'Supabase Postgres',
      'Tailwind',
      'Recharts',
      'Plaid',
      'SnapTrade',
      'Kraken',
      'Vercel',
    ],
    highlights: [
      { value: '76', label: 'SQL migrations' },
      { value: '3', label: 'financial data providers' },
      { value: '12', label: 'app routes with loading UX' },
    ],
    links: [
      { label: 'Live app', href: 'https://ledger-omega-six.vercel.app' },
    ],
    cover: {
      src: '/img/ledger/cover.webp',
      alt: 'Ledger dashboard showing account balances and spending charts',
    },
    images: [
      {
        src: '/img/ledger/cover.webp',
        alt: 'Ledger dashboard showing net worth, alerts, and spending charts',
        caption:
          'Dashboard in demo mode: alerts, net worth over time, and asset breakdown. Sample data, not a real household.',
      },
    ],
    sections: [
      {
        heading: 'What it is',
        body: [
          'Ledger tracks accounts, transactions, bills, budgets, paychecks, investments, loans, credit, and savings for a household rather than a single person. It sits in the same category as Monarch Money, and it is a real subscription product rather than a demo.',
          'I co-founded it and own most of the stack: the Postgres schema and its migrations, the server actions, the sync jobs, the security model, and the front-end.',
        ],
      },
      {
        heading: 'Sync and data providers',
        body: [
          'Plaid covers transactions, investments, and liabilities. SnapTrade covers brokerage holdings, and Kraken covers crypto. A daily Vercel cron reconciles every connection, and each provider write path is idempotent so a retried sync never duplicates a transaction.',
          'Schema changes ship as numbered SQL migrations. There are 76 of them, applied in order, which is the only way multi-provider financial data stays sane over time.',
        ],
      },
      {
        heading: 'Security model',
        body: [
          'Every table is behind row-level security keyed to the authenticated user and their household. Sensitive fields are encrypted at rest with pgcrypto, so a database dump alone is not a breach of account detail.',
          'Accounts support TOTP and WebAuthn MFA. There is also a read-only personal API, scoped per user, for people who want to pull their own numbers into a spreadsheet.',
        ],
      },
      {
        heading: 'Onboarding and perceived speed',
        body: [
          'First login runs a skippable, resumable onboarding flow with six interest-driven paths. Each path writes real records through idempotent server actions rather than staging fake state, so a user who abandons halfway keeps everything they entered.',
          'Navigation across 12 routes has explicit loading UX: route-level skeletons, link-pending indicators, and enter animations, all gated on prefers-reduced-motion.',
        ],
      },
    ],
    featured: true,
  },
  {
    slug: 'welcomeware-emr',
    title: 'EMR Integration Platform',
    shortTitle: 'EMR integrations',
    tagline:
      'REST APIs and integration pipelines connecting patient check-in kiosks to electronic medical record systems.',
    category: 'Production healthcare software — Civicom / Welcomeware',
    track: 'swe',
    dateLabel: 'Feb 2026 — ongoing',
    sortDate: '2026-02',
    role: 'Full-stack engineer, integration lead',
    stack: ['Java', 'Hibernate', 'Maven', 'WildFly', 'MySQL', 'Vue', 'AWS EC2/S3', 'Jenkins'],
    highlights: [
      { value: '+67%', label: 'unit revenue YoY, Q3' },
      { value: 'HIPAA', label: 'compliance boundary' },
    ],
    links: [{ label: 'Welcomeware', href: 'https://welcomeware.net/' }],
    images: [],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Clinics run patient check-in on kiosks, and every clinic runs a different electronic medical record system behind it. Each new EMR partnership used to mean a bespoke integration, and integrations are what closes sales.',
          'I lead the REST API and pipeline work that makes those connections repeatable: shared interfaces, internal tooling, and a data path that holds up under HIPAA constraints. The business unit grew revenue 67% year over year in Q3 while that work landed.',
        ],
      },
      {
        heading: 'Document capture at intake',
        body: [
          'Patients arrive with an insurance card and a driver license, and typing those in by hand is slow and error-prone. I built lightweight automated capture with OpenCV and Tesseract that reads both at the kiosk and pre-fills intake.',
          'The constraint is that it has to be lightweight: this runs beside a live check-in flow, not in a batch job somewhere.',
        ],
      },
      {
        heading: 'Agentic tooling',
        body: [
          'The team is small, so leverage matters. I design and customise agentic AI workflows for internal use: subagents scoped to narrow jobs, deliberate system prompt design, and custom tools and skills injected into agent context.',
        ],
      },
      {
        heading: 'Why there are no screenshots',
        body: [
          'This is proprietary clinical software handling protected health information. The architecture and the outcomes are shareable; the interface and the data are not. Happy to talk through the design in detail over a call.',
        ],
      },
    ],
    featured: true,
  },
  {
    slug: 'flare',
    title: 'FLARE — EV Charger Fault Detection',
    shortTitle: 'FLARE',
    tagline:
      'Crowdsourced fault detection for EV charging stations using semantic segmentation and image classification.',
    category: 'Senior capstone — UC San Diego with SDG&E',
    track: 'ds',
    dateLabel: 'March 2025',
    sortDate: '2025-03',
    role: 'Data scientist, modelling and pipeline',
    team: ['Daniel Kong', 'Ethan Deng', 'Jason Gu', 'Irving Zhao'],
    partners: ['San Diego Gas & Electric', 'UC San Diego HDSI'],
    stack: [
      'PyTorch',
      'NVIDIA mit-b3',
      'OpenCV',
      'Segments.ai',
      'Python',
      'GeoPandas',
      'Statsmodels',
    ],
    highlights: [
      { value: '19.7k', label: 'chargers in scope' },
      { value: '$825k', label: 'monthly revenue modelled as recoverable' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/dskong07/FLARE_ev_infra' },
      { label: 'Project site', href: 'https://jingchenggu.github.io/FLARE-website/' },
    ],
    cover: {
      src: '/img/flare/logo.webp',
      alt: 'FLARE project logo',
    },
    images: [
      {
        src: '/img/flare/segmentation.webp',
        alt: 'Two EV charger photographs with segmentation masks over cable and housing',
        caption: 'Semantic segmentation isolates cable, connector, and housing before classification.',
      },
      {
        src: '/img/flare/model-examples.webp',
        alt: 'Grid of model outputs on EV charger images',
        caption: 'Model outputs across lighting conditions and charger types.',
      },
      {
        src: '/img/flare/labeling.webp',
        alt: 'Segments.ai labeling interface with annotated charger components',
        caption: 'Ground truth labelled in Segments.ai, then fed back for iterative retraining.',
      },
      {
        src: '/img/flare/scoring.webp',
        alt: 'Fault scoring interface showing a health score per submitted photograph',
        caption: 'Health scoring: a binary classifier over the segmented regions.',
      },
      {
        src: '/img/flare/team.webp',
        alt: 'The four-person FLARE team presenting at UC San Diego',
        caption: 'Presented to UCSD faculty and SDG&E stakeholders, March 2025.',
      },
    ],
    sections: [
      {
        heading: 'The premise',
        body: [
          'A broken public EV charger usually stays broken because nobody reports it precisely. Utilities learn about faults late, and every day of downtime is lost charging revenue and a driver who stops trusting the network.',
          'FLARE turns a phone photo into a structured fault report. A driver submits an image, the system segments the charger into its components, classifies whether each looks healthy, and produces a health score tied to that station.',
        ],
      },
      {
        heading: 'Modelling',
        body: [
          'Segmentation uses an NVIDIA mit-b3 SegFormer backbone to isolate cable, connector, and housing, which removes most of the background noise a raw classifier would have to fight. A binary health classifier then runs over the segmented regions.',
          'Ground truth was labelled in Segments.ai. Live inference runs in the cloud, and misclassifications get pulled back into the labelling set for iterative retraining, so the crowdsourced volume is what improves the model.',
        ],
      },
      {
        heading: 'The case for it',
        body: [
          'Alongside the model I analysed the regional network: 19,700+ chargers, time-series and geospatial methods over Alternative Fuels Data Center ingestion, and regression on DMV registration data. That analysis projected up to $825,000 per month in recoverable revenue from faster fault resolution.',
          'That number is what made this a utility conversation rather than a class project. We presented to UCSD faculty and SDG&E stakeholders in March 2025.',
        ],
      },
    ],
    featured: true,
  },
  {
    slug: 'retention-map',
    title: 'Interactive Retention Rates Across the USA',
    shortTitle: 'Retention map',
    tagline:
      'A color-weighted interactive map of grade retention across US states, sliceable by grade level, gender, and ethnicity.',
    category: 'Interactive data visualisation',
    track: 'ds',
    dateLabel: 'February 2024',
    sortDate: '2024-02',
    role: 'Data processing and visualisation',
    team: ['Daniel Kong', 'Jill Nomura'],
    stack: ['D3.js', 'JavaScript', 'Python', 'Pandas', 'TopoJSON'],
    highlights: [
      { value: '51', label: 'states and DC' },
      { value: '772k', label: 'retained students in the dataset' },
    ],
    links: [
      { label: 'Live map', href: 'https://dskong07.github.io/dsc106-US-education/' },
      { label: 'GitHub', href: 'https://github.com/dskong07/dsc106-US-education' },
    ],
    cover: {
      src: '/img/retention/main.webp',
      alt: 'Choropleth map of the United States shaded by student retention',
    },
    images: [
      {
        src: '/img/retention/main.webp',
        alt: 'Choropleth map of the United States shaded by student retention',
        caption: 'The full view: retention across all grades, all demographics.',
      },
      {
        src: '/img/retention/sample-male-aa.webp',
        alt: 'Retention map filtered to African American male students',
        caption: 'Filtered slices expose disparities the aggregate view hides.',
      },
      {
        src: '/img/retention/sample-fem-hisp-middle.webp',
        alt: 'Retention map filtered to Hispanic female middle school students',
        caption: 'Grade level, gender, and ethnicity are all independent filters.',
      },
    ],
    sections: [
      {
        heading: 'What it shows',
        body: [
          'Grade retention, holding a student back a year, is unevenly distributed in ways a national number completely flattens. This map lets you pick a grade level, gender, and ethnicity and see the state-by-state picture for exactly that slice.',
          'The colour weighting is what does the work: the moment you switch demographic filters, the geography of the problem visibly moves.',
        ],
      },
      {
        heading: 'How it was built',
        body: [
          'NCES retention tables came in as per-grade spreadsheets. I processed them in Pandas into per-state, per-demographic aggregates, then rendered the map with D3 and TopoJSON geometry with client-side filtering so slice changes are instant.',
        ],
      },
      {
        heading: 'It also runs this site',
        body: [
          'The particle formation in the hero of this site is built from that same aggregate: 48,009 points sampled inside real Albers-projected state boundaries, coloured by log-scaled retained-student counts. The dataset is a decade of education policy, used here as a texture.',
        ],
      },
    ],
    featured: false,
  },
  {
    slug: 'washington-development',
    title: 'Early Development Metrics in Washington State',
    shortTitle: 'Development metrics',
    tagline:
      'A study of kindergarten development indicators in Washington, and what changed through COVID.',
    category: 'Data analytics and inference',
    track: 'ds',
    dateLabel: 'July 2024',
    sortDate: '2024-07',
    role: 'Analysis and reporting',
    team: ['Daniel Kong', 'Megan Pratt', 'Aishwarya Ramesh', 'Matteo Perona', 'Nilay Menon'],
    stack: ['Python', 'Pandas', 'Statsmodels', 'Matplotlib', 'Seaborn'],
    highlights: [{ value: '6', label: 'development domains tested' }],
    links: [
      {
        label: 'Full report (PDF)',
        href: 'https://github.com/dskong07/coursework-samples/blob/main/Data%20Analysis%20and%20Inference/Final%20Report.pdf',
      },
    ],
    cover: {
      src: '/img/washington/main.webp',
      alt: 'Charts of kindergarten development metrics across Washington state',
    },
    images: [
      {
        src: '/img/washington/main.webp',
        alt: 'Charts of kindergarten development metrics across Washington state',
        caption: 'Development readiness by domain and year.',
      },
      {
        src: '/img/washington/heatmaps.webp',
        alt: 'Heatmaps of development metric correlations',
        caption: 'Correlation structure between development domains.',
      },
      {
        src: '/img/washington/literacy.webp',
        alt: 'Literacy metric trends before and after 2020',
        caption: 'Literacy indicators across the COVID discontinuity.',
      },
    ],
    sections: [
      {
        heading: 'The question',
        body: [
          'Childhood development is one of the stronger predictors of health and wellbeing later in life, and Washington state publishes kindergarten readiness across several development domains. We asked what the trends looked like, and specifically what the 2020 disruption did to them.',
        ],
      },
      {
        heading: 'Method',
        body: [
          'We cleaned and joined the state readiness data, tested domain-level differences with statistical inference rather than eyeballing trend lines, and looked at the pre- and post-2020 split as a discontinuity instead of a smooth trend.',
          'The write-up is a full report, including the places where the data was too coarse to support the conclusion people wanted.',
        ],
      },
    ],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
