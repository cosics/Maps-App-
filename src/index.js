const app = require("./app");

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(client / build));
}
