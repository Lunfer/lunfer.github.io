import * as React from "react";
import "aos/dist/aos.css";

const SKILL_GROUPS = [
  {
    category: "Data Engineering",
    chips: ["Python", "SQL", "MS SQL Server", "SSIS", "Databricks", "Informatica", "BigQuery", "AWS S3", "ETL Pipelines", "Pandas"],
  },
  {
    category: "Analytics & Reporting",
    chips: ["Power BI", "DAX", "Looker Studio", "Google Analytics 4", "Google Tag Manager", "Web Analytics"],
  },
  {
    category: "Machine Learning & AI",
    chips: ["PyTorch", "Keras", "Hugging Face", "LLMs", "Llama 3", "Scikit-learn", "NLP", "Computer Vision"],
  },
  {
    category: "Backend & Dev",
    chips: ["Flask", "REST APIs", "C# / .NET", "JavaScript", "React", "Next.js", "HTML / CSS", "Node.js"],
  },
  {
    category: "Tools & Platforms",
    chips: ["Git", "GitHub", "VS Code", "Jupyter", "Docker (basics)", "Linux"],
  },
  {
    category: "Languages",
    chips: ["Greek (native)", "English (fluent)", "Dutch (learning)", "Spanish (A1+)", "Croatian (A1)", "Italian (A1)", "French (A1)"],
  },
  {
    category: "Soft Skills",
    chips: ["Ownership & Accountability", "Cross-functional Collaboration", "Leadership", "Detail-Oriented", "Fast Learner", "Communication"],
  },
];

const SkillsetBox = () => {
  return (
    <section id="skills" className="glass-card">
      <p className="section-label">05 — Skills</p>
      <h2 className="section-heading">Skillset</h2>

      <p style={{ margin: "0 0 20px", color: "#333", fontFamily: "Dosis, sans-serif", fontSize: "0.97rem", lineHeight: 1.7 }}>
        35+ completed courses across Data Engineering, Machine Learning, Analytics, and
        Software Development. Strong sense of ownership — I love building things end-to-end
        and have a keen eye for detail.
      </p>

      {SKILL_GROUPS.map((group) => (
        <div key={group.category} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.45)",
              marginBottom: 8,
              fontFamily: "Dosis, sans-serif",
            }}
          >
            {group.category}
          </div>
          <div>
            {group.chips.map((chip) => (
              <span key={chip} className="skill-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default SkillsetBox;
