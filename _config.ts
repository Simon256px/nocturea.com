import lume from "lume/mod.ts";

const site = lume({
  src: "./src",
  dest: "./_site",
  // Keep the existing /about.html style URLs. Lume defaults to pretty URLs
  // (/about/), which would break every inbound link to the live site.
  prettyUrls: false,
  // Lume's dev server defaults to port 80.
  server: {
    port: 3000,
    page404: "/404.html",
  },
});

// Passed through untouched — Lume only copies what you declare.
site.copy("global.css");
site.copy("public");

export default site;
