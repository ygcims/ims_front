import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function Report() {
  const [reports, setReports] = useState([]);
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    report: "",
  });
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/getReports`
      );
      setReports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Split the value into year, month, and day parts
    const [selectedYear, selectedMonth, selectedDay] = value
      .split("-")
      .map(Number);

    if (name === "startDate") {
      // Calculate the end date based on the user's input
      const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
      const nextYear = nextMonth === 1 ? selectedYear + 1 : selectedYear;
      let nextDay = selectedDay;

      // Check if the next month has fewer days
      const daysInNextMonth = new Date(nextYear, nextMonth, 0).getDate();
      if (nextDay > daysInNextMonth) {
        nextDay = daysInNextMonth;
      }

      const endDateString = `${nextYear}-${nextMonth
        .toString()
        .padStart(2, "0")}-${nextDay.toString().padStart(2, "0")}`;

      setInputs((inputs) => ({
        ...inputs,
        startDate: value,
        endDate: endDateString,
      }));
    } else {
      setInputs((inputs) => ({
        ...inputs,
        [name]: value,
      }));
    }
  };

  const handleReportAccess = () => {
    if (inputs.startDate && inputs.endDate && inputs.report) {
      const selectedReport = reports.find(
        (report) => report.id === parseInt(inputs.report)
      );

      if (selectedReport) {
        const reportLink = selectedReport.link;

        // Add query parameters for startDate and endDate to the report link
        const startDateParam = `startDate=${encodeURIComponent(
          inputs.startDate
        )}`;
        const endDateParam = `endDate=${encodeURIComponent(inputs.endDate)}`;
        const updatedReportLink = `${reportLink}?${startDateParam}&${endDateParam}`;

        window.location.href = updatedReportLink;
      } else {
        swal("Error", "Selected report not found", "error");
      }
    } else {
      swal("Error", "Please fill all the fields", "error");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7 space-y-4">
              <h1 className="font-bold text-center text-2xl mb-5">
                Generate Reports
              </h1>
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  Sart Date
                </label>
                <input
                  // onChange={handleChange}
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 roundedzz py-3 px-4 rounded"
                  name="startDate"
                  value={inputs.startDate}
                  onChange={handleChange}
                  type="date"
                ></input>
              </div>

              <div className="md:w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  End Date
                </label>
                <input
                  // onChange={handleChange}
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 rounded"
                  name="endDate"
                  value={inputs.endDate}
                  onChange={handleChange}
                  type="date"
                ></input>
              </div>

              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-state"
                >
                  Select Report
                </label>
                <div className="relative">
                  <select
                    // onChange={handleChange}
                    className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                    name="report"
                    value={inputs.report}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {reports.map((report) => (
                      <option key={report.id} value={report.id}>
                        {report.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="py-5">
              <div className="flex flex-row justify-end">
                <div className="text-center sm:text-right  whitespace-nowrap">
                  <button
                    onClick={handleReportAccess}
                    className="transition duration-200 mx-8 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg bg-blue-900 hover:bg-blue-800 focus:bg-blue-900 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                  >
                    <span className="inline-block mr-2">Generate</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
