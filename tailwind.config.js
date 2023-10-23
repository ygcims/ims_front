// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Define custom CSS classes here
      redStar: {
        "&::after": {
          content: '""',
          display: "inline-block",
          color: "red",
          marginLeft: "2px",
          fontSize: "12px",
          lineHeight: "1",
        },
      },
    },
  },
  plugins: [],
};
