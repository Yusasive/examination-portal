const server = require("./app");
const PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server started. Listening on port ${PORT}`);
});

