import * as React from "react";

const STACK = [
  { label: "Next.js", href: "https://nextjs.org/", icon: "/nextjs.svg" },
  { label: "React", href: "https://reactjs.org/", icon: "/react.svg" },
  { label: "Material UI", href: "https://mui.com/", icon: "/materialUI.svg" },
  { label: "Figma", href: "https://www.figma.com/", icon: "/figma.svg" },
];

const CustomFooter = () => {
  return (
    <footer
      style={{
        background: "#3b2a1a",
        color: "rgba(255,255,255,0.75)",
        padding: "28px 32px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        fontFamily: "Dosis, sans-serif",
        fontSize: "0.82rem",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Left: copyright */}
      <span>© {new Date().getFullYear()} Zoe Kousteni · Hosted on GitHub Pages</span>

      {/* Centre: stack icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ marginRight: 8, opacity: 0.6 }}>Built with</span>
        {STACK.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            <img src={s.icon} alt={s.label} width={24} height={14} style={{ display: "block" }} />
          </a>
        ))}
      </div>

      {/* Right: icon credit */}
      <span>
        Icons by{" "}
        <a
          href="https://icons8.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
        >
          Icons8
        </a>
      </span>
    </footer>
  );
};

export default CustomFooter;
