import { useEffect, useMemo, useState } from 'react';
import { skillFilters, skillGroups } from '../../content';
import { ScrollTrigger } from '../../lib/gsap';

type Filter = (typeof skillFilters)[number]['id'];

export function Skills() {
  const [filter, setFilter] = useState<Filter>('all');

  const groups = useMemo(
    () =>
      skillGroups.filter(
        (group) => filter === 'all' || group.track === filter || group.track === 'both',
      ),
    [filter],
  );

  // Filtering changes the page height, which invalidates every trigger below.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <section className="skills section" id="skills">
      <div className="shell">
        <p className="mono section-label">Stack</p>

        <div className="skills-head">
          <h2 className="section-title">What I actually reach for.</h2>
          <div className="skills-filters" role="group" aria-label="Filter skills by track">
            {skillFilters.map((option) => (
              <button
                aria-pressed={filter === option.id}
                className="mono skills-filter"
                data-active={filter === option.id}
                key={option.id}
                onClick={() => setFilter(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <dl className="skills-grid">
          {groups.map((group) => (
            <div className="skills-group" key={group.id} data-track={group.track}>
              <dt className="mono skills-group-label">{group.label}</dt>
              <dd>
                <ul className="chip-row">
                  {group.items.map((item) => (
                    <li
                      className="tag"
                      data-track={group.track === 'both' ? undefined : group.track}
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
