const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/create", (req, res) => {
  const {
    userName,
    mobile_number,
    email,
    resumes,
    message,
  } = req.body;

  if (!userName || !mobile_number || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const insertQuery = `
    INSERT INTO crscandidate (
      userName,
      mobile_number,
      email,
      resumes,
      message
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    userName,
    mobile_number,
    email,
    resumes,
    message,
  ];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error("Error executing INSERT query:", error);
      return res.status(500).json({ error: "Internal Server Error", error });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.json({
      message: `Candidate ${userName} ${mobile_number} created successfully`,
      candidateId: results.insertId,
    });
  });
});

router.get("/:id", (req, res) => {
  const candidateId = req.params.id;

  const selectByIdQuery = `
    SELECT *
    FROM crsCandidate
    WHERE id = ?
  `;

  connection.query(selectByIdQuery, [candidateId], (error, results) => {
    if (error) {
      console.error("Error executing SELECT query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Their is no such Candidate data in our cadidates Query" });
    }

    const candidateData = results[0];
    res.json(candidateData);
  });
});

router.get("/", (req, res) => {
  const selectAllQuery = "SELECT * FROM crsdatabase.crscandidate";

  connection.query(selectAllQuery, (error, results) => {
    if (error) {
      console.error("Error executing SELECT query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const reversedResults = results.reverse();
    res.json(reversedResults);
  });
});

router.get("/download/:id", (req, res) => {
  const candidateId = req.params.id;

  const selectResumeQuery = "SELECT resumes FROM crscandidate WHERE id = ?";

  connection.query(selectResumeQuery, [candidateId], (error, results) => {
    if (error) {
      console.error("Error fetching resume data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0 || !results[0].resumes) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumesBuffer = results[0].resumes;

    // Set the appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');

    // Send the binary data
    res.send(resumesBuffer);
  });
});


module.exports = router;
