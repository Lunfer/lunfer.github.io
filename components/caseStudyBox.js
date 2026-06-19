import * as React from "react";

const TAGS = ["Power BI", "SQL", "Data Modelling", "DAX", "Data Visualisation", "Fictional Dataset"];

const CaseStudyBox = () => {
  return (
    <section id="case-studies" className="glass-card">
      <p className="section-label">04.5 — Case Study</p>
      <h2 className="section-heading">Case Study</h2>

      {/* Description */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.05rem",
            fontFamily: "Dosis, sans-serif",
            color: "#1a1a1a",
            marginBottom: 8,
          }}
        >
          PulseClub — Fitness Analytics Case Study
        </div>
        <p className="body-text" style={{ marginBottom: 12 }}>
          An end-to-end analytics case study on a fictional fitness club chain operating across the Netherlands,
          Belgium, France, Germany, and Spain. Built a full star-schema data model from scratch, designed DAX
          measures for membership, churn, visit behaviour, and app engagement, and delivered an interactive
          Power BI report with custom tooltips, slicers, and a branded theme.
        </p>

        {/* Tool note */}
        <p className="body-text" style={{ marginBottom: 16 }}>
          The report was originally built in Power BI. A static HTML version is available via the Interactive Dashboard button
          below that was co-developed with Claude so that it can be accessed without a Power BI license. Note that there are several differences between the static version and the original Power BI report. The original .pbix file can be found in the repository at
          CaseStudies/PulseClubCS/PulseClub - Case study.pbix.
        </p>

        {/* Tags */}
        <div style={{ marginBottom: 20 }}>
          {TAGS.map((tag) => (
            <span key={tag} className="skill-chip" style={{ fontSize: "0.78rem" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="/pulseclub-dashboard.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#446F6B",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: "Dosis, sans-serif",
            fontWeight: 700,
            fontSize: "0.88rem",
            textDecoration: "none",
            transition: "background 0.2s, box-shadow 0.2s",
            boxShadow: "0 2px 10px rgba(68,111,107,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#355956";
            e.currentTarget.style.boxShadow = "0 4px 18px rgba(68,111,107,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#446F6B";
            e.currentTarget.style.boxShadow = "0 2px 10px rgba(68,111,107,0.25)";
          }}
        >
          📊 Interactive Dashboard
        </a>
      </div>

      {/* Preview — static snapshot of report page 1 */}
      <div
        style={{
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#b8bec5",
          lineHeight: 0,
        }}
      >
        <img
          src="/images/pulseclub-preview.jpg"
          alt="PulseClub dashboard preview — page 1"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 16,
          }}
        />
      </div>
      <p
        style={{
          marginTop: 8,
          fontSize: "0.75rem",
          color: "rgba(0,0,0,0.4)",
          textAlign: "center",
          fontFamily: "Dosis, sans-serif",
        }}
      >
        Sneak peek — click "Interactive Dashboard" above to explore the full report
      </p>
    </section>
  );
};

export default CaseStudyBox;
