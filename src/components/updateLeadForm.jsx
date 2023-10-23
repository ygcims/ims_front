import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UpdateLeadForm({ userRole, userId }) {
  const [batches, setBatches] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [newFollowups, setNewFollowups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { leadId } = useParams();
  const app_url = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
    scheduled_to: "",
    date: "",
    statusid: "",
    source_id: "",
    course_id: "",
    batch_id: "",
    name: "",
    email: "",
    mobile1: "",
    mobile2: "",
    dob: "",
    gender: "",
    nic: "",
    passport: "",
    school: "",
    address: "",
    userid: "",
    fdate: "",
    fstatus: "",
    fcomment: "",
  });

  const handleLeadChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    fetchStatuses();
    fetchBatches();
    fetchLeadData();
    fetchFollowups();
    if (userRole == 2) {
      fetchCounselors();
    }
    // Update the current date every second
    const interval = setInterval(() => {
      const currentDate = new Date();
      setCurrentDate(currentDate);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [leadId]);

  const convertMySQLDateToInputFormat = (mysqlDate) => {
    if (!mysqlDate) {
      return "null"; // Return "null" when the date value is null
    }

    const dateObj = new Date(mysqlDate);
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const convertDateToMySQLDatetimeFormat = (dateObject) => {
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getUTCDate()).padStart(2, "0");
    const hours = String(dateObject.getUTCHours()).padStart(2, "0");
    const minutes = String(dateObject.getUTCMinutes()).padStart(2, "0");
    const seconds = String(dateObject.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let requiredFields = [
      "date",
      "statusid",
      "source_id",
      "course_id",
      "name",
      "mobile1",
      "address",
    ];

    if (loading) return; // Prevent multiple submissions while loading

    setLoading(true); // Set loading state

    inputs.dob = new Date(inputs.dob);
    inputs.scheduled_to = new Date(inputs.scheduled_to);
    inputs.date = new Date(inputs.date);
    inputs.date = convertDateToMySQLDatetimeFormat(inputs.date);
    inputs.dob = convertDateToMySQLDatetimeFormat(inputs.dob);
    inputs.scheduled_to = convertDateToMySQLDatetimeFormat(inputs.scheduled_to);

    // Check if any of the required fields is empty
    const isAnyRequiredFieldEmpty = requiredFields.some(
      (field) => !inputs[field]
    );

    // Convert empty strings to null values
    const processedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [
        key,
        (key === "scheduled_to" || key === "dob") &&
        (value === "" || isNaN(new Date(value)))
          ? null
          : value,
      ])
    );
    
    delete processedInputs.newest_date;

    console.log("Processed inputs " + JSON.stringify(processedInputs, null, 2));

    if (!isAnyRequiredFieldEmpty) {
      try {
        const res = await axios.post(`${app_url}/datamanagement/updateLead`, {
          leadId,
          processedInputs,
        });
        // Show a success Swal message
        swal("Success!", "Lead updated successfully.", "success").then(() => {
          // Redirect to the /leads page after user clicks OK
          window.location.href = "/leads";
        });
      } catch (err) {
        console.log(err);

        if (err.response && err.response.data && err.response.data.errors) {
          // Display validation errors in a suitable format
          const errorMessages = err.response.data.errors.join("\n");
          swal("Validation Error", errorMessages, "error");
        } else {
          swal("Error!", "An error occurred while adding the lead.", "error");
        }
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      // Show a warning Swal message
      swal(
        "Incomplete Fields",
        "Please fill in all the required fields.",
        "warning"
      );
    }
  };

  useEffect(() => {
    if (userRole === 3) {
      setInputs((prev) => ({ ...prev, assignto: userId }));
    }
  }, [userRole, userId]);

  const fetchLeadData = async () => {
    try {
      const res = await axios.post(`${app_url}/leads/getLeadData`, { leadId });
      const fetchedData = res.data[0];

      // Convert date strings from the fetched data into JavaScript Date objects
      const dateFields = ["date", "dob", "scheduled_to"];
      for (const field of dateFields) {
        if (fetchedData[field]) {
          fetchedData[field] = new Date(fetchedData[field]);
        }
      }

      setInputs(fetchedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await axios.post(`${app_url}/leads/getFollowUpDetails`, {
        leadId,
      });
      setFollowups(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/sources`);
      fetchSources(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/statuses`);
      setStatuses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/batches`);
      setBatches(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/counselors`);
      setCounselors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFollowup = (e) => {
    e.preventDefault();
    setNewFollowups((prevFollowups) => [...prevFollowups, {}]);
  };

  const isFormDisabled = userRole === 2;

  return (
    <>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <input
              required
              disabled
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="date"
              type="date"
              value={convertMySQLDateToInputFormat(inputs.date)}
            ></input>
          </div>

          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                disabled
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="statusid"
              >
                <option value={inputs.statusid || ""}>
                  {inputs.status_name}
                </option>
              </select>
            </div>
          </div>

          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Source <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                disabled
                required
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="source_id"
              >
                <option value={inputs.source_id || ""}>
                  {inputs.source_name}
                </option>
              </select>
            </div>
          </div>
          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                disabled
                required
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="course_id"
              >
                <option value={inputs.course_id || ""}>
                  {inputs.course_name}
                </option>
              </select>
            </div>
          </div>

          <div className="md:w-1/2 px-3">
            <label
              required
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Batch
            </label>
            <div className="relative">
              <select
                onChange={handleLeadChange}
                disabled={isFormDisabled}
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="batch_id"
                value={inputs.batch_id || ""} // Set value to an empty string if it's null
              >
                <option value="">Select</option>{" "}
                {batches.map((batch) => (
                  <option key={batch.code} value={batch.code}>
                    {batch.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr className="my-8" />
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              disabled
              required
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="name"
              type="text"
              placeholder="Jane Doe"
              value={inputs.name}
            ></input>
          </div>
          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              email
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="email"
              onChange={handleLeadChange}
              type="email"
              placeholder="example@gmail.com"
              value={inputs.email}
            ></input>
          </div>
        </div>
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Contact number 1 <span className="text-red-500">*</span>
            </label>
            <input
              required
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="mobile1"
              type="text"
              placeholder="+94"
              value={inputs.mobile1}
            ></input>
          </div>
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Contact number 2
            </label>
            <input
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="mobile2"
              type="text"
              placeholder="+94"
              value={inputs.mobile2}
            ></input>
          </div>
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              DOB
            </label>
            <input
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="dob"
              type="date"
              value={convertMySQLDateToInputFormat(inputs.dob)}
            ></input>
          </div>

          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              gender
            </label>
            <select
              onChange={handleLeadChange}
              className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
              name="gender"
              type="text"
              placeholder="+94"
              value={inputs.gender}
            >
              <option value="">Select</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="-">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-nic"
            >
              NIC
            </label>
            <input
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="nic"
              type="text"
              value={inputs.nic}
            ></input>
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-passport"
            >
              Passport
            </label>
            <input
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="passport"
              type="text"
              value={inputs.passport}
            ></input>
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="address"
              type="text"
              placeholder="Kiribathgoda"
              value={inputs.address}
            ></textarea>
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              School
            </label>
            <input
              onChange={handleLeadChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="school"
              type="text"
              placeholder="Albuquerque"
              value={inputs.school}
            ></input>
          </div>
        </div>
        <hr className="my-8" />

        <div className="-mx-3 md:flex mb-2 justify-between">
          <div className="md:w-2/4 px-0 mb-6 md:mb-0 md:flex">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Schedule to
              </label>
              <input
                disabled={isFormDisabled}
                onChange={handleLeadChange}
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                name="scheduled_to"
                type="date"
                value={convertMySQLDateToInputFormat(inputs.scheduled_to)}
              />
            </div>
            {userRole == 2 && (
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  Assign to
                </label>
                <select
                  onChange={handleLeadChange}
                  className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                  name="userid"
                  value={inputs.userid}
                >
                  <option value="">Select</option>
                  {counselors.map((counselor) => (
                    <option key={counselor.id} value={counselor.id}>
                      {counselor.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <hr className="my-8" />

        {/* lead history */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl mb-6">Lead History</h3>
          <button
            onClick={handleAddFollowup}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div className="mb-2">
          {followups.map((followup) => (
            <div key={followup.fid} className="-mx-3 md:flex mb-2">
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      type="date"
                      disabled
                      readOnly
                      value={convertMySQLDateToInputFormat(followup.date)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      disabled
                      readOnly
                      value={followup.statusid}
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Comment
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      type="text"
                      disabled
                      readOnly
                      value={followup.comment}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {newFollowups.map((followups, index) => (
            <div key={index} className="-mx-3 md:flex mb-2">
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      onChange={handleLeadChange}
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      name="fdate"
                      type="datetime-local"
                      value={currentDate.toISOString().slice(0, -1)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      onChange={handleLeadChange}
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      name="fstatus"
                    >
                      <option value="">Select</option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Comment
                    </label>
                    <textarea
                      onChange={handleLeadChange}
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                      name="fcomment"
                      type="text"
                      placeholder="Put a comment here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-row items-center ml-auto">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Update Lead"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateLeadForm;
