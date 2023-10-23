import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import swal from "sweetalert";

function Roster() {
  const [user, setUser] = useState({ name: "" });
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedHalfDay, setSelectedHalfDay] = useState("");
  const app_url = import.meta.env.VITE_API_URL;

  // Get the user data from the database
  const { userID } = useParams();
  const [fullDays, setFullDays] = useState([]);
  const [halfDay, setHalfDay] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.post(
        `${app_url}/datamanagement/getUser`,
        { userID }
      );
      const userData = res.data[0];
      setUser(userData);
      setFullDays(userData.full_days.split(","));
      setHalfDay(userData.half_day);
    } catch (error) {
      console.log(error);
    }
  };

  const Days = [
    { name: "Monday", value: "Mon" },
    { name: "Tuesday", value: "Tue" },
    { name: "Wednesday", value: "Wed" },
    { name: "Thursday", value: "Thu" },
    { name: "Friday", value: "Fri" },
    { name: "Saturday", value: "Sat" },
    { name: "Sunday", value: "Sun" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedDays.join(","), selectedHalfDay, userID);

    // Check if selectedHalfDay is also selected in selectedDays
    if (selectedDays.includes(selectedHalfDay)) {
      swal(
        "Error",
        "You cannot select the same day for both full day and half day.",
        "error"
      );
    } else if (selectedDays.length === 0) {
      swal("Error", "Please fill in all the fields", "error");
    } else {
      try {
        const res = await axios.post(
          `${app_url}/datamanagement/updateUser`,
          {
            selectedDays: selectedDays.join(","),
            selectedHalfDay: selectedHalfDay,
            userID: userID,
          }
        );
        swal("Success", "Roster updated successfully", "success").then(() => {
          window.location.href = "/admin/dashboard";
        });
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7 space-y-4">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                User Name:
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={user.name}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
              />
            </div>
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Full days:
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={fullDays.join(",")}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
              />
            </div>
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Half day:
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={halfDay}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
              />
            </div>
            <h2 className="font-bold text-center text-xl mb-5">Roster</h2>
            <div className="md:w-full px-3 mb-6 md:mb-0 grid grid-cols-3 gap-2">
              {Days.map((days) => (
                <div key={days.value} className="space-x-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={days.value}
                      checked={selectedDays.includes(days.value)}
                      onChange={(e) => {
                        const day = e.target.value;
                        setSelectedDays((prevDays) =>
                          prevDays.includes(day)
                            ? prevDays.filter((d) => d !== day)
                            : [...prevDays, day]
                        );
                      }}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
                    />
                    <span className="ml-2">{days.name}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-800">
                Select Half Day:
              </label>
              <select
                value={selectedHalfDay}
                onChange={(e) => setSelectedHalfDay(e.target.value)}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
              >
                <option value="">Select</option>
                {Days.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-5">
            <div className="flex flex-row justify-end">
              <div className="text-center sm:text-right  whitespace-nowrap">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="transition duration-200 mx-8 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg bg-blue-900 hover:bg-blue-800 focus:bg-blue-900 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roster;
