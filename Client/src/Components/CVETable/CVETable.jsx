import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CVETable.module.css";
const CVETable = () => {
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  useEffect(() => {
    fetchCves();
  }, [currentPage, resultsPerPage]); // Fetch when currentPage or resultsPerPage changes

  const fetchCves = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/paginate/?page=${currentPage}&pageSize=${resultsPerPage}`
      );
      const data = response.data;
      console.log(data);
      setCves(data.result);
      setTotalRecords(data.totalCount);
    } catch (error) {
      console.error("Error fetching CVEs:", error);
    }
  };

  const handleResultsPerPageChange = (e) => {
    setResultsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing results per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const totalPages = Math.ceil(totalRecords / resultsPerPage);

  return (
    <div className={styles.container}>
      <h1>CVE LIST</h1>
      <p>
        <b>Total Records: {totalRecords}</b>
      </p>
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>IDENTIFIER</th>
            <th>PUBLISHED DATE</th>
            <th>LAST MODIFIED DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.id}>
              <td>{cve.id}</td>
              <td>{cve.sourceIdentifier}</td>
              <td>{formatDate(cve.published)}</td>
              <td>{formatDate(cve.lastModified)}</td>
              <td>{cve.vulnStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.options}>
        <div className={styles.resultsPerPage}>
          <p>
            <b>Results per Page</b>
          </p>
          <select
            className={styles.select}
            value={resultsPerPage}
            onChange={handleResultsPerPageChange}
          >
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVETable;
