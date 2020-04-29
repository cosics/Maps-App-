const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 4000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(client / build));
}

mongoose(connect(procces.env.MONGODB_URI));
