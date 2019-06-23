const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log(
    "Server if listening at http://localhost:3000/ Let's plat a game!"
  );
});
