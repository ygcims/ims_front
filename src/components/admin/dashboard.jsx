import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [halfDayWorkers, setHalfDayWorkers] = useState([]);
  const [fullDayWorkers, setFullDayWorkers] = useState([]);
  const [data, setData] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getAllData();
    fetchTodayWorkingPeople();
  }, []);

  const getAllData = async () => {
    try {
      const response = await fetch(
        `${app_url}/leads/getLeadsCount1`
      );
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTodayWorkingPeople = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/counselors`
      );

      const allUsers = res.data;

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const currentDay = daysOfWeek[new Date().getDay()];

      const halfDayUsers = allUsers.filter(
        (user) => user.half_day === currentDay
      );

      const fullDayUsers = allUsers.filter(
        (user) => user.full_days && user.full_days.includes(currentDay)
      );

      setHalfDayWorkers(halfDayUsers);
      setFullDayWorkers(fullDayUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const totalLeads = data.reduce((acc, curr) => {
    return acc + curr.number_of_leads;
  }, 0);

  return (
    <div className="px-8 py-6 min-h-screen rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Lead Performance Summary
        </h2>
        <h3 className="text-xl font-semibold">Total Leads: {totalLeads}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((entry) => (
          <div
            key={entry.status_id}
            className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-95 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-600">
              {entry.status_name}
            </h3>
            <p className="text-xl mb-1">{entry.number_of_leads}</p>
            <p className="text-gray-600">{entry.percentage}%</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">On Duty Today</h2>

        <div className="mt-6">
          <h3 className="text-l font-semibold mb-2">Full-Day Staff</h3>
          {fullDayWorkers.length === 0 ? (
            <p className="text-gray-600 pl-4">
              No full day workers scheduled for today.
            </p>
          ) : (
            <div className="flex flex-wrap space-x-2">
              {fullDayWorkers.map((worker) => (
                <span
                  key={worker.id}
                  className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 mb-2 mr-2 flex items-center"
                >
                  {worker.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-l font-semibold mb-2">Half-Day Staff</h3>
          {halfDayWorkers.length === 0 ? (
            <p className="text-gray-600 pl-4">
              No half day workers scheduled for today.
            </p>
          ) : (
            <div className="flex flex-wrap space-x-2">
              {halfDayWorkers.map((worker) => (
                <span
                  key={worker.id}
                  className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 mb-2 mr-2 flex items-center"
                >
                  {worker.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
