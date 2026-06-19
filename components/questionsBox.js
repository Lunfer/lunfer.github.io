import * as React from "react";
import "aos/dist/aos.css";

const QA = [
  {
    q: "What are your hobbies outside of work?",
    a: "Working out and gaming — so yeah, pretty competitive by nature. But the goal is always to beat my past self, not anyone else. Getting 1% better every day is the real game.",
  },
  {
    q: "Are you interested in learning new technologies?",
    a: "Always. I love how technology evolves and becomes more user-friendly over time. Right now I'm deepening my data engineering skills and keeping a close eye on advances in ML and data visualisation. I am a fan of all-things new, whether that is a new language (Dutch, Spanish, Python, R), a new framework (Next.js, React, Vue), or a new tool (Looker, Power BI, Tableau). You will always find me tinkering with something new, and I love sharing what I learn with others.",
  },
  {
    q: "What's the technical challenge you're most proud of?",
    a: "Teaching myself a big chunk of HTML/CSS/JS with no formal front-end background — and then shipping real projects with it. It proved to me that passion has no ceiling. Also, later in my career, I got to create a full and meaningful Looker report with all sorts of commercial and ad/campaign data that is still being used today. That was a big moment for me.",
  },
  {
    q: "What do you value most about a team?",
    a: "Clear communication and smart task allocation. A well-organised team and a team with clear communicators doesn't just deliver — it teaches and learns as it goes. That knowledge-sharing dynamic is incredibly powerful.",
  },
];

const QuestionsBox = () => {
  return (
    <section className="glass-card">
      <p className="section-label">06 — A little extra</p>
      <h2 className="section-heading">Interviewing Myself</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {QA.map(({ q, a }) => (
          <div key={q}>
            <p
              style={{
                margin: "0 0 6px",
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: "Dosis, sans-serif",
                color: "#1a1a1a",
              }}
            >
              {q}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.97rem",
                lineHeight: 1.7,
                color: "#333",
                fontFamily: "Dosis, sans-serif",
              }}
            >
              {a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuestionsBox;