import * as React from "react";
import "aos/dist/aos.css";

// Top 5 newest certifications — update as new ones are earned
const TOP_CERTS = [
  {
    title: "Introduction to Deep Learning with PyTorch",
    issuer: "DataCamp",
    date: "Aug 2025",
  },
  {
    title: "Object-Oriented Programming in Python",
    issuer: "DataCamp",
    date: "Aug 2025",
  },
  {
    title: "Writing Efficient Python Code",
    issuer: "DataCamp",
    date: "Jul 2025",
  },
  {
    title: "Introduction to Llama 3",
    issuer: "DataCamp",
    date: "Jul 2025",
  },
  {
    title: "OOP in Python — Advanced",
    issuer: "DataCamp",
    date: "Jul 2025",
  },
];

const ALL_CERTS_URL = "https://www.linkedin.com/in/zoikousteni/details/certifications/";

const CertificationsBox = () => {
  return (
    <section id="certifications" className="glass-card">
      <p className="section-label">06 — Certifications</p>
      <h2 className="section-heading">Certifications</h2>

      <p
        style={{
          margin: "0 0 18px",
          fontSize: "0.88rem",
          color: "rgba(0,0,0,0.5)",
          fontFamily: "Dosis, sans-serif",
        }}
      >
        35+ certifications from DataCamp, Accenture, Google, NVIDIA, Coursera, LinkedIn Learning, and Udemy.
        Showing the 5 most recent.
      </p>

      {TOP_CERTS.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 0",
            borderBottom: i < TOP_CERTS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            🎓
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                fontFamily: "Dosis, sans-serif",
                color: "#1a1a1a",
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "#555",
                fontFamily: "Dosis, sans-serif",
              }}
            >
              {c.issuer} · {c.date}
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <a
          href={ALL_CERTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "9px 22px",
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 999,
            fontFamily: "Dosis, sans-serif",
            fontWeight: 700,
            fontSize: "0.88rem",
            color: "#1a1a1a",
            letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.85)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.6)")}
        >
          View all certifications on LinkedIn ↗
        </a>
      </div>
    </section>
  );
};

export default CertificationsBox;
