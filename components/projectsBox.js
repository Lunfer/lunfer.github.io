import * as React from "react";
import "aos/dist/aos.css";

const PROJECTS = [
  {
    title: "Car Reviews — LLM Analysis",
    description:
      "Used large language models to analyse and classify car reviews, extracting sentiment and key themes from unstructured text data. Explored various LLM prompting strategies for structured output.",
    tags: ["Python", "LLMs", "NLP", "Pandas"],
    url: "https://github.com/Lunfer/analysing_car_reviews_with_llms",
  },
  {
    title: "Email Classifier with Llama 3",
    description:
      "Built an email classification pipeline using Meta's Llama 3 model to automatically categorise incoming emails by intent and priority. Focused on fine-tuning prompts for high accuracy on noisy real-world text.",
    tags: ["Python", "Llama 3", "Hugging Face", "NLP"],
    url: "https://github.com/Lunfer/email_classifier_with_llama",
  },
  {
    title: "Netflix Movies — Exploratory Data Analysis",
    description:
      "Investigated the Netflix movies dataset with Python and Pandas, uncovering trends in release years, genres, ratings, and content diversity. Produced visualisations to communicate findings clearly.",
    tags: ["Python", "Pandas", "Data Visualisation", "EDA"],
    url: "https://github.com/Lunfer/investigating_netflix_movies",
  },
  {
    title: "Thesis — Human-Robot Interaction & Trust",
    description:
      "Bachelor's thesis exploring the dynamics of trust in human-robot interaction using AI-based modelling. Investigated how design and behaviour affect user trust in robotic systems.",
    tags: ["Machine Learning", "HRI", "Research", "AI"],
    url: "https://polynoe.lib.uniwa.gr/xmlui/handle/11400/5720",
    isThesis: true,
  },
];

const ProjectsBox = () => {
  return (
    <section id="projects" className="glass-card">
      <p className="section-label">04 — Projects</p>
      <h2 className="section-heading">Projects</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {PROJECTS.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 16,
                padding: "18px 20px",
                height: "100%",
                boxSizing: "border-box",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.14)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: "Dosis, sans-serif",
                  color: "#1a1a1a",
                  marginBottom: 8,
                }}
              >
                {p.isThesis ? "📄 " : "💻 "}
                {p.title}
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  color: "#444",
                  lineHeight: 1.6,
                  fontFamily: "Dosis, sans-serif",
                  marginBottom: 12,
                }}
              >
                {p.description}
              </div>
              <div>
                {p.tags.map((tag) => (
                  <span key={tag} className="skill-chip" style={{ fontSize: "0.78rem" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProjectsBox;
