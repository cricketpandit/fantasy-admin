module.exports = {
  name: 'india-fantasy-admin',
  script: "serve",
  env: {
    PM2_SERVE_PATH: 'build',
    PM2_SERVE_PORT: 3002,
    PM2_SERVE_SPA: 'true',
  }
}
//test
