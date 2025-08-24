/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily:{
        Jost:["Jost", "sans-serif"],
        Gothic:["Special Gothic Expanded One", "sans-serif"]
      },
    },
    screens:{
    sm:"340px",
    md:"540px",
    lg:"768px",
    xl:"1180px"
    },
    container:{
      center:true,
      padding:{
        DEFAULT:"12px",
        md:"32px"
      }
    },
    
  },
  plugins: [],
}

