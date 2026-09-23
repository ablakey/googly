module.exports = {
  root: "./src",
  // Relative paths so the build works under a GitHub Pages project subpath.
  base: "./",
  server: {
    host: true,
  },
  build: {
    outDir: "../dist",
  },
  publicDir: "./lib/models",
};
