import * as React from "react";
import "aos/dist/aos.css";

const EDUCATION = [
  {
    degree: "Bachelor of Engineering — Industrial Design & Production Engineering",
    school: "University of West Attica, Athens, Greece",
    period: "2014 — Oct 2023",
    details: [
      "Grade: 8.03 · 365 ECTs",
      "Former Department of Automation Engineering",
      "Activities: University Music Team",
    ],
    thesis: {
      label: "Thesis: Human-Robot Interaction and Trust",
      url: "https://polynoe.lib.uniwa.gr/xmlui/handle/11400/5720",
    },
  },
  {
    degree: "Erasmus+ Exchange — Electrical Engineering & Computer Science",
    school: "University of Osijek, Osijek, Croatia",
    period: "2018 — 2019",
    details: [
      "Courses: Cryptography and System Security",
      "Earned A1 certificate in Croatian language",
    ],
    thesis: null,
  },
];

const EducationBox = () => {
  return (
    <section id="education" className="glass-card">
      <p className="section-label">02 — Education</p>
      <h2 className="section-heading">Education</h2>

      {EDUCATION.map((e, i) => (
        <div key={i} className="timeline-entry">
          <div className="timeline-role">{e.degree}</div>
          <div className="timeline-company">{e.school}</div>
          <div className="timeline-period">{e.period}</div>
          <div className="timeline-desc">
            {e.details.map((d, j) => (
              <div key={j} style={{ marginBottom: 2 }}>{d}</div>
            ))}
            {e.thesis && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={e.thesis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1a1a1a",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontFamily: "Dosis, sans-serif",
                  }}
                >
                  {e.thesis.label} ↗
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default EducationBox;
