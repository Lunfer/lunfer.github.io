import * as React from "react";
import "aos/dist/aos.css";

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zoikousteni/",
    icon: "/linkedin.svg",
  },
  {
    label: "GitHub",
    href: "https://github.com/Lunfer",
    icon: "/github.svg",
  },
  {
    label: "DataCamp",
    href: "https://www.datacamp.com/profile/zoikousteni",
    icon: "/datacamp.svg",
  },
  {
    label: "Email",
    href: "mailto:zoikousteni@hotmail.com",
    icon: "/email.svg",
  },
];

const ContactBox = () => {
  return (
    <section id="contact" className="glass-card">
      <p className="section-label">05 — Contact</p>
      <h2 className="section-heading">Get in Touch</h2>
      <p className="body-text" style={{ marginBottom: 24 }}>
        Always happy to connect — whether it&apos;s about a project, an opportunity,
        or just a good conversation. Find me on:
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 999,
              padding: "8px 18px",
              fontFamily: "Dosis, sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#1a1a1a",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.55)")}
          >
            <img src={l.icon} alt={l.label + " icon"} width={20} height={20} style={{ display: "block" }} />
            {l.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default ContactBox;