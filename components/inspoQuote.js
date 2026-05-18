import * as React from "react";

const quotes = [
  '"The question isn\'t who is going to let me; it\'s who is going to stop me." — Ayn Rand',
  '"Don\'t let you be the reason why you\'re not advancing or becoming who you want to be." — Joanne S. Bass',
  '"The most common way people give up their power is by thinking they don\'t have any." — Alice Walker',
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"Perfection is not attainable, but if we chase perfection we can catch excellence." — Vince Lombardi',
  '"Do or do not. There is no try." — Yoda',
  '"If you hear a voice within you say, \'You cannot paint,\' then by all means paint and that voice will be silenced." — Van Gogh',
  '"There is only one way to avoid criticism: do nothing, say nothing, and be nothing." — Aristotle',
];

const InspoQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return <span style={{ fontFamily: "Dosis, sans-serif", fontSize: "0.92rem" }}>{quote}</span>;
};

export de