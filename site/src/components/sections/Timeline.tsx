import { education, roles } from '../../content';

/** Oldest first: the timeline reads left to right as the career happened. */
const ordered = [...roles].reverse();

export function Timeline() {
  return (
    <section className="timeline" id="timeline">
      <div className="timeline-pin">
        <div className="shell timeline-head">
          <p className="mono section-label">History</p>
          <h2 className="section-title">Six roles, two tracks, one line.</h2>
        </div>

        <div className="timeline-viewport">
          <ol className="timeline-track" data-timeline-track>
            {ordered.map((role) => (
              <li className="timeline-card" key={role.id} data-track={role.track}>
                <p className="mono timeline-year">{role.since.slice(0, 4)}</p>
                <div className="timeline-card-body">
                  <span className="tag" data-track={role.track}>
                    {role.track === 'ds' ? 'Data' : 'Engineering'}
                  </span>
                  <h3 className="timeline-role">{role.title}</h3>
                  <p className="timeline-org">
                    {role.org}
                    {role.orgNote ? ` (${role.orgNote})` : ''}
                  </p>
                  <p className="mono muted">
                    {role.start} — {role.end} · {role.location}
                  </p>
                  <p className="timeline-summary">{role.summary}</p>
                  {role.metric && (
                    <p className="timeline-metric">
                      <span>{role.metric.value}</span>
                      <span className="mono muted">{role.metric.label}</span>
                    </p>
                  )}
                  <ul className="chip-row">
                    {role.stack.slice(0, 4).map((item) => (
                      <li className="tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}

            <li className="timeline-card timeline-card-edu" key="education">
              <p className="mono timeline-year">2025</p>
              <div className="timeline-card-body">
                <span className="tag">Education</span>
                <h3 className="timeline-role">{education.degree}</h3>
                <p className="timeline-org">{education.school}</p>
                <p className="mono muted">
                  Graduated {education.graduated} · GPA {education.gpa} ({education.gpaNote})
                </p>
                <ul className="course-list">
                  {education.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>
            </li>
          </ol>
        </div>

        <div className="timeline-progress" aria-hidden="true">
          <span className="timeline-progress-bar" data-timeline-bar />
        </div>
      </div>
    </section>
  );
}
