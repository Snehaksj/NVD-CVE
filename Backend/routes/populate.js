import express from "express";
import CVE from "../model/cve.js";
import axios from "axios";
import cron from "node-cron";
import "dotenv/config.js";

const router = express.Router();
const API = process.env.API;

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
let lastUpdateTime = null;

const fetchData = async (startIndex, resultsPerPage) => {
  try {
    const response = await axios.get(API, {
      params: {
        startIndex: startIndex,
        resultsPerPage: resultsPerPage,
      },
      timeout: 60000,
      maxContentLength: 100000000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      console.error("Request timed out:", error);
      throw new Error("Request timed out");
    } else {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
};

const populate = async () => {
  let startIndex = 0;
  let resultsPerPage = 2000;
  let totalResults = 0;
  do {
    const data = await fetchData(startIndex, resultsPerPage);
    if (!data) {
      console.error("Failed to fetch data. Aborting population.");
      return;
    }
    totalResults = data.totalResults;
    const vulnerabilities = data.vulnerabilities.map((item) => item.cve);
    console.log(startIndex);
    console.log(totalResults);
    console.log(resultsPerPage);
    for (let i = 0; i < vulnerabilities.length; i++) {
      const currentitem = vulnerabilities[i];
      await CVE.findOneAndUpdate({ id: currentitem.id }, currentitem, {
        upsert: true,
        new: true,
      });
      console.log("inserted ", currentitem.id);
    }
    startIndex += resultsPerPage;
    if (totalResults - startIndex < resultsPerPage) {
      resultsPerPage = totalResults - startIndex;
    }
    await sleep(6000);
  } while (startIndex < totalResults);
  lastUpdateTime = new Date();
};

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running population process...");

    const currentTime = new Date();
    const timeDiff = currentTime - (lastUpdateTime || new Date(0));
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const fullRefreshInterval = 7 * oneDayInMillis;

    if (!lastUpdateTime || timeDiff >= fullRefreshInterval) {
      await populate();
      console.log("Full population process completed.");
    }
  } catch (error) {
    console.error("Error during population process:", error);
  }
});

router.post("/", async (req, res) => {
  try {
    await populate();
    res.status(200).send("CVE collection populated successfully.");
  } catch (error) {
    console.error("Error populating CVE collection:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/removeDuplicates", async (req, res) => {
//   try {
//     const allCVEs = await CVE.find({});

//     const uniqueCVEsMap = new Map();

//     allCVEs.forEach((cve) => {
//       uniqueCVEsMap.set(cve.id, cve);
//     });

//     const uniqueCVEs = Array.from(uniqueCVEsMap.values());
//     // const uniqueCVEsJSON = JSON.stringify(uniqueCVEs);
//     if (allCVEs.length != uniqueCVEs.length) {
//       await CVE.deleteMany({});

//       await CVE.insertMany(uniqueCVEs);
//     }

//     res.status(200).send("Duplicates removed successfully");
//   } catch (error) {
//     console.error("Error removing duplicate records:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

export default router;
