const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/create", (req, res) => {
  const { userName, mobile_number, email, company_name, message } = req.body;

  if (!userName || !mobile_number || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const insertQuery = `
    INSERT INTO crscorporate (
      userName,
      mobile_number,
      email,
      company_name,
      message
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [userName, mobile_number, email, company_name, message];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error("Error executing INSERT query:", error);
      return res.status(500).json({ error: "Internal Server Error", error });
    }

    res.json({
      message: `Corporate ${userName} ${company_name} created successfully`,
      corporateId: results.insertId,
    });
  });
});

router.get("/:id", (req, res) => {
  const corporateId = req.params.id;

  const selectByIdQuery = `
    SELECT *
    FROM crsCorporate
    WHERE id = ?
  `;

  connection.query(selectByIdQuery, [corporateId], (error, results) => {
    if (error) {
      console.error("Error executing SELECT query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: "Their is no such Candidate data in our cadidates Query",
      });
    }

    const corporateData = results[0];
    res.json(corporateData);
  });
});

router.get("/", (req, res) => {
  const selectAllQuery = "SELECT * FROM crsdatabase.crscorporate";

  connection.query(selectAllQuery, (error, results) => {
    if (error) {
      console.error("Error executing SELECT query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const reversedResults = results.reverse();
    res.json(reversedResults);
  });
});

module.exports = router;
