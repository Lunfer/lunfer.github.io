import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "aos/dist/aos.css";

const QuestionsBox = () => {
  return (
    <React.Fragment>
      <Box
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-anchor="#contactBox"
        data-aos-anchor-placement="center-center"
        sx={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "none",
          borderRadius: "40px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h5" sx={{ borderBottom: "1px solid" }}>
          Interviewing myself
        </Typography>
        <Typography variant="h6">
          What are your hobbies outside of work?
        </Typography>
        <Typography variant="subtitle1">
          I love to work out and play video games, so you can say I&apos;m
          pretty competitive but the key is to always compete with my past self
          rather than my fellow athletes/gamers/peers. Getting better in what I
          do is one of my aspirations!
        </Typography>
        <Typography variant="h6">
          Are you interested in learning new technologies? Which ones and why?
        </Typography>
        <Typography variant="subtitle1">
          I am always interested in learning something new, I love the way
          technology evolves and how it&apos;s getting more and more user
          friendly and ergonomic. I am currently learning React as I would love
          to give that &quot;breath of life&quot; to the websites I am making
          and that React provides. As an aspiring Data Scientist, I&apos;m also
          in love with every new way to visualise data, extract data as well as
          use them in new machine learning algorithms! The future is exciting!
        </Typography>
        <Typography variant="h6">
          What&apos;s the technical challenge you are most proud of?
        </Typography>
        <Typography variant="subtitle1">
          For some, it may seem small, but having no educational background
          around front-end &quot;magic&quot; and yet being able to learn a BIG
          part of HTML/CSS/JS by myself is always going to be one of my proudest
          moments. It really proved to me that my passion has no limits.
        </Typography>
        <Typography variant="h6">
          What do you value the most about a team?
        </Typography>
        <Typography variant="subtitle1">
          I strongly believe that a well-organised team in terms of both
          communication and task allocation is a team that&apos;s soon going to
          thrive and deliver. Every task that is assigned to a team rather than
          an individual offers strong bonding on top of the possibility for
          everyone to be taught or teach, something new. Isn&apos;t that
          powerful?
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default QuestionsBox;
