import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useParams } from "react-router-dom";

function AddBatchForm() {
  const { codeId } = useParams();
  const [courses, setCourses] = useState([]);
  const [inputs, setInputs] = useState({
    code: "",
    description: "",
    orientation_date: "",
    commencement_date: "",
    fee: "",
    course: "",
  });
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCourses();
    fetchBatchDetails();
  }, [codeId]);

  const handleInputChange = (e) => {
    e.persist();
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/courses`
      );
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBatchDetails = async () => {
    try {
      const res = await axios.post(
        `${app_url}/datamanagement/getSelectedBatch`,
        { codeId }
      );

      

      if (Array.isArray(res.data) && res.data.length > 0) {
        const batchData = res.data[0];
        console.log(res.data);
        // format date to YYYY-MM-DD
        batchData.orientation_date = formatDateToYYYYMMDD(
          batchData.orientation_date
        );
        batchData.commencement_date = formatDateToYYYYMMDD(
          batchData.commencement_date
        );
        setInputs({
          code: batchData.code || "",
          description: batchData.description || "",
          orientation_date: batchData.orientation_date || "",
          commencement_date: batchData.commencement_date || "",
          fee: batchData.fee || "",
          course: batchData.course_id || "",
        });
      } else {
        console.log("No data found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  function formatDateToYYYYMMDD(dateString) {
    try {
      const dateParts = dateString.split("T")[0].split("-");
      if (dateParts.length === 3) {
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      } else {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      console.error(`Error formatting date: ${error.message}`);
      return dateString; // Return the original date string in case of an error
    }
  }

  const handleSubmit = async () => {
    try {
      console.log(inputs);
      if (codeId) {
        const res = await axios.post(
          `${app_url}/datamanagement/updateBatch`,
          inputs
        );
      } else {
        const res = await axios.post(
          `${app_url}/datamanagement/addBatch`,
          inputs
        );
      }
      swal("Success!", "Batch added successfully.", "success").then(() => {
        // Redirect to the /leads page after user clicks OK
        window.location.href = "/admin/data";
      });
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with an error status code (4xx or 5xx)
        swal("Error", "An error occurred. Please try again later.", "error");
      } else if (err.request) {
        // The request was made but no response was received
        swal(
          "Error",
          "No response from the server. Please try again later.",
          "error"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        swal("Error", "An error occurred. Please try again later.", "error");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <h1 className="font-bold text-center text-2xl mb-5">
                Add New Batch
              </h1>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Course Name
              </label>
              <select
                type="text"
                name="course"
                value={inputs.course}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="">Select</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Batch Code
              </label>
              <input
                type="text"
                name="code"
                {...(codeId && { disabled: true })}
                value={inputs.code}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Orientation Date
              </label>
              <input
                type="date"
                name="orientation_date"
                value={formatDateToYYYYMMDD(inputs.orientation_date)}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Commencement Date
              </label>
              <input
                type="date"
                name="commencement_date"
                value={formatDateToYYYYMMDD(inputs.commencement_date)}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Fee
              </label>
              <input
                type="text"
                name="fee"
                value={inputs.fee}
                placeholder="LKR"
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                value={inputs.description}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
            </div>
            <div className="py-5">
              <div className="flex justify-end">
                <div className="text-center sm:text-right  whitespace-nowrap">
                  <button
                    onClick={handleSubmit}
                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                  >
                    <span className="inline-block mr-2">
                      {codeId ? "Update" : "Add"}
                    </span>
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

export default AddBatchForm;
