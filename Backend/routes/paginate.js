import express from "express";
import CVE from "../model/cve.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const skip = (page - 1) * pageSize;
    const result = await CVE.find().skip(skip).limit(pageSize);
    const totalCount = await CVE.countDocuments();

    const response = {
      result,
      totalCount,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching the records", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
