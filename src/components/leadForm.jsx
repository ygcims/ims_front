import { useEffect, useState } from "react";
import axios from "axios";

function LeadForm({ userRole, userId }) {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const app_url = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
    scheduledto: "",
    date: new Date().toISOString().split("T")[0],
    status: "",
    source: "",
    course: "",
    batch: "",
    name: "",
    email: "",
    contact1: "",
    contact2: "",
    dob: "",
    gender: "",
    nic: "",
    passport: "",
    school: "",
    address: "",
    comment: "",
    assignto: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    fetchCources();
    fetchSources();
    fetchStatuses();
    fetchBatches();
    if (userRole == 2) {
      fetchCounselors();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions while loading

    setLoading(true); // Set loading state

    let requiredFields = [
      "date",
      "status",
      "source",
      "course",
      "name",
      "contact1",
      "address",
    ];

    // Check if any of the required fields is empty
    const isAnyRequiredFieldEmpty = requiredFields.some(
      (field) => !inputs[field]
    );

    // Convert empty strings to null values
    const processedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    if (!isAnyRequiredFieldEmpty) {
      try {
        const res = await axios.post(
          `${app_url}/datamanagement/addLead`,
          processedInputs
        );
        console.log(processedInputs); // Assuming the backend sends a response that you want to log

        // Show a success Swal message
        swal("Success!", "Lead updated successfully.", "success").then(() => {
          // Redirect to the /leads page after user clicks OK
          window.location.href = "/leads";
        });
        // set all inputs to its initial state
        setInputs({
          scheduledto: "",
          date: new Date().toISOString().split("T")[0],
          status: "",
          source: "",
          course: "",
          batch: "",
          name: "",
          email: "",
          contact1: "",
          contact2: "",
          dob: "",
          gender: "",
          nic: "",
          passport: "",
          school: "",
          address: "",
          comment: "",
          assignto: "",
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
      // If the userRole is 3, set the 'assignto' field to the userId
      setInputs((prev) => ({ ...prev, assignto: userId }));
    }
  }, [userRole, userId]);

  const fetchCources = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/courses`);
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get(`${app_url}/datamanagement/sources`);
      setSources(res.data);
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
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
                onChange={handleChange}
                required
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="status"
              >
                <option value="">Select</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
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
                onChange={handleChange}
                required
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="source"
              >
                <option value="">Select</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
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
                onChange={handleChange}
                required
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="course"
              >
                <option value="">Select</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:w-1/2 px-3">
            <label
              required
              onChange={handleChange}
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              Batch
            </label>
            <div className="relative">
              <select
                className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                name="batch"
              >
                <option value="">Select</option>
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
              required
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="name"
              type="text"
              placeholder="Jane Doe"
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
              onChange={handleChange}
              type="email"
              placeholder="example@gmail.com"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="contact1"
              type="text"
              placeholder="+94"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="contact2"
              type="text"
              placeholder="+94"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="dob"
              type="date"
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
              onChange={handleChange}
              className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
              name="gender"
              type="text"
              placeholder="+94"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="nic"
              type="text"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4 mb-3"
              name="passport"
              type="text"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="address"
              type="text"
              placeholder="Kiribathgoda"
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
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="school"
              type="text"
              placeholder="Albuquerque"
            ></input>
          </div>
        </div>
        <hr className="my-8" />
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Comment
            </label>
            <textarea
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
              name="comment"
              type="text"
              placeholder="Kiribathgoda"
            ></textarea>
          </div>
        </div>
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
                onChange={handleChange}
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
                name="scheduledto"
                type="date"
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
                  onChange={handleChange}
                  className="block appearance-select w-full bg-grey-lighter border border-gray-400 text-grey-darker py-3 px-4 pr-8 rounded"
                  name="assignto"
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

          <div className="px-3 mt-10 md:mb-0">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Add New Lead'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default LeadForm;
