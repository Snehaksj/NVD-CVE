import express from "express";
import CVE from "../model/cve.js";
const router = express.Router();

router.get("id/:id", async (req, res) => {
  try {
    const idValue = req.params.id;
    const result = await CVE.findOne({ id: idValue });
    if (!result) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/year/:year", async (req, res) => {
  try {
    const yearValue = parseInt(req.params.year);
    const result = await CVE.find({
      $expr: {
        $eq: [{ $year: "$published" }, yearValue],
      },
    });
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No records found for the year" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching by year:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/baseScore/:score", async (req, res) => {
  try {
    const scoreValue = req.params.score;
    const result = await CVE.find({
      "metrics.cvssMetricV2.0.cvssData.baseScore": scoreValue,
    });
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the score" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching by score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/lastModified/:days", async (req, res) => {
  try {
    const days = req.params.days;
    if (!days || isNaN(days)) {
      return res.status(400).json({ message: "Invalid days parameter" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await CVE.find({
      lastModified: { $gte: startDate },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching by last modified:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
