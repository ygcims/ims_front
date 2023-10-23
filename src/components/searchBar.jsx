import React, { useState, useEffect } from "react";
import axios from "axios";

export function SearchBarCounselor({
  startDate,
  endDate,
  status,
  source,
  course,
  onChange,
}) {
  const [courses, setCourses] = useState([]);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    status: "",
    source: "",
    course: "",
  });

  useEffect(() => {
    fetchCources();
    fetchSources();
    fetchStatuses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    console.log(inputs);

    // Call the onChange function with the updated parameters
    onChange({
      startDate: name === "startDate" ? value : startDate,
      endDate: name === "endDate" ? value : endDate,
      status: name === "status" ? value : status,
      source: name === "source" ? value : source,
      course: name === "course" ? value : course,
    });
  };

  const fetchCources = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/courses`
      );
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/sources`
      );
      setSources(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/statuses`
      );
      setStatuses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
      <div className="-mx-3 md:flex mb-2">
        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-city"
          >
            Start Date
          </label>
          <input
            onChange={handleChange}
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
            name="startDate"
            type="date"
          ></input>
        </div>

        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-city"
          >
            End Date
          </label>
          <input
            onChange={handleChange}
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-400 rounded py-3 px-4"
            name="endDate"
            type="date"
          ></input>
        </div>

        <div className="md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-state"
          >
            Status
          </label>
          <div className="relative">
            <select
              onChange={handleChange}
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
            Source
          </label>
          <div className="relative">
            <select
              onChange={handleChange}
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
            Course
          </label>
          <div className="relative">
            <select
              onChange={handleChange}
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
      </div>
    </div>
  );
}
