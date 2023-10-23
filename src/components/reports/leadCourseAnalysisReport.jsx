import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LeadCourseAnalysisReport = () => {
  const [courseData, setCourseData] = useState([]);
  const [courseLeadsData, setCourseLeadsData] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;
  let stDate, edDate;

  const [outputs, setOutputs] = useState({
    startDateReturn: "",
    endDateReturn: "",
  });

  useEffect(() => {
    // Fetch data here
    getParameterDates();
    getAllCourseData();
    getCourseLeadsData();
    getAllCounselors();
  }, []);

  const getParameterDates = () => {
    // Function to parse URL parameters
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    } // Get the start and end dates from URL parameters
    const urlStartDate = getParameterByName("startDate");
    const urlEndDate = getParameterByName("endDate");

    // Set the state with the extracted dates
    if (urlStartDate && urlEndDate) {
      stDate = urlStartDate;
      edDate = urlEndDate;
      setOutputs({
        startDateReturn: stDate,
        endDateReturn: edDate,
      });
    }
  };

  // Function to format the date
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Determine the suffix for the day of the month
    let daySuffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    }

    return `${day}${daySuffix} ${month} ${year}`;
  }

  const getAllCourseData = async () => {
    try {
      const response = await axios.get(
        `${app_url}/datamanagement/courses`
      );
      setCourseData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseLeadsData = async () => {
    try {
      const response = await axios.post(
        `${app_url}/leads/getCourseLeadsCountAll`,
        {
          stDate,
          edDate,
        }
      );
      setCourseLeadsData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get all counselors
  const getAllCounselors = async () => {
    try {
      const response = await axios.get(
        `${app_url}/datamanagement/counselors`
      );
      setCounselors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to download the report as PDF
  const downloadPdf = () => {
    // Get the element
    const element = document.getElementById("pdf-content");

    // Create a new PDF instance with landscape orientation
    const pdf = new jsPDF("l", "mm", "a4");

    // Define custom styles for the PDF
    const pdfStyles = `
    <style>
      table {
        width: 90%;
        border-collapse: collapse;
      }
      th, td {
        padding: 4px;
        text-align: left;
      }
    </style>
  `;

    // Append custom styles to the element
    element.innerHTML = pdfStyles + element.innerHTML;

    // Add margins (adjust these values as needed)
    const leftMargin = 10;
    const topMargin = 10;

    html2canvas(element, { scrollX: 0, scrollY: 0 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Calculate the width and height to fit the entire table on one page
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * leftMargin;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add the image to the PDF with margins
      pdf.addImage(imgData, "PNG", leftMargin, topMargin, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save("Lead_Course_Analysis.pdf");
    });
  };

  return (
    <div id="pdf-content" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Lead Course Analysis</h2>
      <div className="flex flex-row justify-between">
        <div className="mb-4 text-sm">
          <span className="font-semibold pr-4 m-auto">
            Report Duration (Period):
          </span>
          <span>
            {formatDate(outputs.startDateReturn)} to{" "}
            {formatDate(outputs.endDateReturn)}
          </span>
        </div>
        <div className="mb-4 text-sm">
          <span>
            <a target="_blank" rel="noreferrer">
              <img
                src="https://img.icons8.com/ios/50/000000/download--v1.png"
                alt="download pdf"
                width="30"
                height="30"
                onClick={downloadPdf}
                style={{ cursor: "pointer" }}
              />
            </a>
          </span>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="text-left py-2 px-4">Lead Course</th>
            <th className="text-right pr-4 py-2">Total</th>
            {counselors.map((counselor) => (
              <th className="text-right pr-4 py-2" key={counselor.id}>
                {counselor.name}
              </th>
            ))}
            <th className="text-right pr-4 py-2">Registrations</th>
          </tr>
        </thead>
        <tbody>
          {courseData.map((course) => {
            const matchingEntries = courseLeadsData.filter(
              (entry) => entry.course_id === course.id
            );
            const totalLeads = matchingEntries.reduce(
              (acc, entry) => acc + entry.number_of_leads,
              0
            );
  
            // Group leads by counselor
            const leadsByCounselor = {};
            matchingEntries.forEach((entry) => {
              if (!leadsByCounselor[entry.counselor_name]) {
                leadsByCounselor[entry.counselor_name] = 0;
              }
              leadsByCounselor[entry.counselor_name] += entry.number_of_leads;
            });
  
            const leads = counselors.map((counselor) =>
              leadsByCounselor[counselor.name] || 0
            );
  
            // Fetch registrations from courseLeadsData
            const matchingEntries3 = courseLeadsData.filter(
              (entry) => entry.course_id === course.id
            );
            const totalRegistrations = matchingEntries3.reduce(
              (acc, entry) => acc + entry.registered_leads,
              0
            );
  
            return (
              <tr
                className={
                  course.name === "Registered"
                    ? "border bg-green-200"
                    : "border"
                }
                key={course.id}
              >
                <td className="py-2 px-4">{course.name}</td>
                <td className="text-right py-2 px-4">
                  {totalLeads > 0 ? totalLeads : 0}
                </td>
                {leads.map((leadCount, index) => (
                  <td className="text-right py-2 px-4" key={index}>
                    {leadCount}
                  </td>
                ))}
                <td className="text-right py-2 px-4">
                  {totalRegistrations > 0 ? totalRegistrations : 0}
                </td>
              </tr>
            );
          })}
          <tr className="bg-blue-900 text-white">
            <td className="py-2 px-4">Total</td>
            <td className="text-right py-2 px-4">
              {courseLeadsData.reduce(
                (acc, entry) => acc + entry.number_of_leads,
                0
              )}
            </td>
            {counselors.map((counselor, index) => (
              <td className="text-right pr-4 py-2" key={index}>
                {courseLeadsData.reduce(
                  (acc, entry) =>
                    entry.counselor_name === counselor.name
                      ? acc + entry.number_of_leads
                      : acc,
                  0
                )}
              </td>
            ))}
            <td className="text-right py-2 px-4">
              {courseLeadsData.reduce(
                (acc, entry) => acc + entry.registered_leads,
                0
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
};

export default LeadCourseAnalysisReport;
