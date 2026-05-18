import * as React from "react";
import AboutMeBox from "./aboutMeBox";
import EducationBox from "./educationBox";
import ExpBox from "./expBox";
import ProjectsBox from "./projectsBox";
import SkillsetBox from "./skillsetBox";
import CertificationsBox from "./certificationsBox";
import ContactBox from "./contactBox";
import QuestionsBox from "./questionsBox";

const BoxGridder = () => {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 24px 0",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <AboutMeBox />
      <EducationBox />
    