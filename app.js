const express = require("express");
const app = express();
app.use(express.json({ extended: false }));




// api routes
app.use("/api/getRequiredName", require("./routes/appRoutes"));


const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
