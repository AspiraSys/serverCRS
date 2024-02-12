const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/create", (req, res) => {
  const {
    jobCode,
    industry,
    designation,
    location,
    country,
    job_link,
    job_description,
    key_Responsibility,
    preferred_Qualification,
    b_Qualification,
    post_date,
  } = req.body;

  if (
    !jobCode ||
    !industry ||
    !designation ||
    !location ||
    !job_link ||
    !job_description ||
    !country ||
    !post_date
  ) {
    return res.status(400).json({ error: "Missing required fields!! Kindly Fill the fields Properly" });
  }

  const checkDuplicateQuery =
    "SELECT COUNT(*) AS count FROM crsjoblist WHERE jobCode = ?";
  connection.query(checkDuplicateQuery, [jobCode], (error, results) => {
    if (error) {
      console.error("Error checking for duplicate jobCode:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const jobCodeCount = results[0].count;

    if (jobCodeCount > 0) {
      return res.status(400).json({ error: "Your JobCode must be unique" });
    }

    const insertQuery = `
      INSERT INTO crsjoblist (
        jobCode,
        industry,
        designation,
        location,
        country,
        job_link,
        job_description,
        key_Responsibility,
        preferred_Qualification,
        b_Qualification,
        post_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      jobCode,
      industry,
      designation,
      location,
      country,
      job_link,
      job_description,
      key_Responsibility,
      preferred_Qualification,
      b_Qualification,
      post_date,
    ];

    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error("Error executing INSERT query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: `Job added successfully!!` });
    });
  });
});

router.put("/edit/:jobCode", (req, res) => {
  const jobCodeParam = req.params.jobCode;

  const {
    industry,
    designation,
    location,
    country,
    job_link,
    job_description,
    key_Responsibility,
    preferred_Qualification,
    b_Qualification,
    post_date,
  } = req.body;

  if (
    !industry &&
    !designation &&
    !location &&
    !country &&
    !job_link &&
    !job_description &&
    !key_Responsibility &&
    !preferred_Qualification &&
    !b_Qualification &&
    !post_date
  ) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const updateQuery = `
    UPDATE crsjoblist
    SET
      industry = ?,
      designation = ?,
      location = ?,
      country = ?,
      job_link = ?,
      job_description = ?,
      key_Responsibility = ?,
      preferred_Qualification = ?,
      b_Qualification = ?,
      post_date = ?
    WHERE jobCode = ?
  `;

  const values = [
    industry,
    designation,
    location,
    country,
    job_link,
    job_description,
    key_Responsibility,
    preferred_Qualification,
    b_Qualification,
    post_date,
    jobCodeParam,
  ];

  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error("Error executing UPDATE query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: `Job of ${jobCodeParam} updated successfully` });
  });
});

router.delete("/:jobCode", (req, res) => {
  const jobCode = req.params.jobCode;

  const deleteQuery = `
    DELETE FROM crsjoblist
    WHERE jobCode = ?
  `;

  connection.query(deleteQuery, [jobCode], (error, results) => {
    if (error) {
      console.error("Error executing DELETE query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      message: `Job with JobCode ${jobCode} deleted successfully`,
    });
  });
});

router.get("/:jobCode", (req, res) => {
  const jobCodeParam = req.params.jobCode;

  const selectQuery = `
    SELECT *
    FROM crsjoblist
    WHERE jobCode = ?
  `;

  connection.query(selectQuery, [jobCodeParam], (error, results) => {
    if (error) {
      console.error("Error executing SELECT query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "There is no such JobCode in our lists" });
    }

    const jobData = results[0];
    res.json( jobData );
  });
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM crsdatabase.crsjoblist";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const reversedResults = results.reverse();
    res.json(reversedResults);
  });
});

module.exports = router;
