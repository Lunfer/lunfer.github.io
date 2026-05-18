import * as React from "react";
import "aos/dist/aos.css";

const EXPERIENCE = [
  {
    role: "Data Engineer",
    company: "Accenture Greece",
    period: "Oct 2024 — Present · Full-time · Athens, Hybrid",
    desc: "Working in a large-scale data engineering environment, building and maintaining data pipelines and ETL workflows. Collaborating with cross-functional teams to deliver data-driven solutions for enterprise clients.",
  },
  {
    role: "Data Engineer",
    company: "SLEED",
    period: "Apr 2024 — Oct 2024 · 7 mos · Hybrid",
    desc: "Developed and maintained data pipelines and integrations. Worked closely with the analytics team to ensure data quality and availability across reporting systems.",
  },
  {
    role: "Web Analytics Engineer",
    company: "SLEED",
    period: "Jun 2023 — Apr 2024 · 11 mos · Hybrid",
    desc: "Implemented and managed web tracking solutions using Google Tag Manager and Google Analytics 4. Built reporting dashboards in Looker Studio and supported data-driven decision making across marketing and product teams.",
  },
  {
    role: "Project Coordinator (Data)",
    company: "Intrum",
    period: "Aug 2022 — May 2023 · 10 mos · Full-time",
    desc: "Coordinated data-related projects across teams, ensuring timely delivery and accuracy of reporting. Acted as a bridge between technical and business stakeholders to translate data needs into actionable insights.",
  },
  {
    role: "Data Engineer",
    company: "Evolution Tech",
    period: "Apr 2022 — Jul 2022 · 4 mos · Contract",
    desc: "Built and optimised data pipelines and ETL processes on a contract basis, delivering scalable data infrastructure for the client's analytics stack.",
  },
  {
    role: "Software Engineer",
    company: "Squaredev",
    period: "Dec 2021 — Mar 2022 · 4 mos · Full-time · Athens",
    desc: "Built full-stack web applications and REST APIs. Worked across the product lifecycle from backend logic to frontend delivery using JavaScript, React, and various frameworks.",
  },
  {
    role: "Developer",
    company: "Zero to MVP Inc",
    period: "Jun 2021 — Oct 2021 · 5 mos · Apprenticeship",
    desc: "Focused on JavaScript and C# / .NET to automate processes and deliver projects. Gained hands-on experience with REST API implementations in a fast-paced startup environment.",
  },
  {
    role: "Data Science Intern",
    company: "EWORX S.A.",
    period: "Jul 2020 — Sep 2020 · 3 mos · Apprenticeship · Khalándrion",
    desc: "First tech role — learned Python and R for data manipulation and visualisation, working on real business data projects from day one.",
  },
];

const ExpBox = () => {
  return (
    <section id="experience" className="glass-card">
      <p className="section-label">03 — Experience</p>
      <h2 className="section-heading">Experience</h2>

      {EXPERIENCE.map((e, i) => (
        <div key={i} className="timeline-entry">
          <div className="timeline-role">{e.role}</div>
          <div className="timeline-company">{e.company}</div>
          <div className="timeline-period">{e.period}</div>
          <div className="timeline-desc">{e.desc}</div>
        </div>
      ))}
    </section>
  );
};

export default ExpBox;
