import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const InspoQuote = () => {
  const quotes = [
    "'The question isn't who is going to let me; it's who is going to stop me.' - Ayn Rand",
    "'Don't let you be the reason why you're not advancing or becoming who you want to be.' -Joanne S. Bass",
    "'The most common way people give up their power is by thinking they don’t have any.' -Alice Walker",
    "'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle.' -Steve Jobs",
    "'Perfection is not attainable, but if we chase perfection we can catch excellence.' -Vince Lombardi",
    "'Do or do not. There is no try.' -Yoda",
    "'If you hear a voice within you say, ‘You cannot paint,’ then by all means paint and that voice will be silenced.' -Vincent Van Gogh",
    "'There is only one way to avoid criticism: Do nothing, say nothing, and be nothing.' -Aristotle",
  ];
  var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <React.Fragment>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Typography>{randomQuote}</Typography>
      </Box>
    </React.Fragment>
  );
};

export default InspoQuote;
