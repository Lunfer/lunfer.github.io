import * as React from "react";
import "aos/dist/aos.css";

const AboutMeBox = () => {
  return (
    <section id="about" className="glass-card">
      <p className="section-label">01 — About</p>
      <h2 className="section-heading">About Me</h2>
      <p className="body-text">
        Being in the job industry since 2017, I have navigated through various professional
        environments — from sales and customer-facing roles to data engineering and software
        development. My experience in sales has forged me into a strong communicator with a
        people-first mindset that I carry into every technical role I take on.
      </p>
      <p className="body-text" style={{ marginTop: 12 }}>
        I&apos;m passionate about data, machine learning, and the way technology can solve
        real problems. I love to learn across disciplines — languages, design, and engineering
        all live on my radar. I studied abroad at the University of Osijek in Croatia through
        the <strong>Erasmus+</strong> programme, completed a Bachelor&apos;s in Industrial
        Design &amp; Production Engineering at the University of West Attica, and wrote an
        <strong> AI-based thesis</strong> on Human-Robot Interaction and Trust.
      </p>
      <p className="body-text" style={{ marginTop: 12 }}>
        Currently based in <strong>Rotterdam, NL</strong> and actively learning Dutch. 🇳🇱
      </p>
    </section>
  );
};

export default AboutMeBox;