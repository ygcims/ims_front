import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useParams } from "react-router-dom";

function AddStatusForm() {
  const { id } = useParams();
  const app_url = import.meta.env.VITE_API_URL;
  const [inputs, setInputs] = useState({
    name: "",
  });

  useEffect(() => {
    fetchStatusDetails();
  }, [id]);

  const handleInputChange = (e) => {
    e.persist();
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchStatusDetails = async () => {
    try {
      const res = await axios.post(
        `${app_url}/datamanagement/getSelectedStatus`,
        { id }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        const statusData = res.data[0];
        setInputs({
          name: statusData.name || "",
        });
      } else {
        console.log("No data found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        inputs.id = id;
        console.log(inputs);
        const res = await axios.post(
          `${app_url}/datamanagement/updateStatus`,
          inputs
        );
      } else {
        const res = await axios.post(
          `${app_url}/datamanagement/addStatus`,
          inputs
        );
      }
      swal("Success!", "Status added successfully.", "success").then(() => {
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
                Add New Status
              </h1>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={inputs.name}
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
                      {id ? "Update" : "Add"}
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

export default AddStatusForm;
