const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require('./config/dbConfig')
const jobRouter = require('./routes/jobData')
const candidateRouter = require('./routes/candidatesData')
const corporateRouter = require('./routes/corporatesData')

require("dotenv").config({ path: ".env" });


const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());

app.use('/job', jobRouter);
app.use("/candidate", candidateRouter);
app.use("/corporate", corporateRouter);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/", (req, res) => {
  try {
    res.send("Hey !! Shall start the backend");
  } catch (err) {
    res.status(400).json(err);
  }
});

app.listen(process.env.APP_PORT || 2400);