import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = ({ userId }) => {
  const [data, setData] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getCounselorData();
  }, []);

  const getCounselorData = async () => {
    try {
      const response = await axios.post(
       `${app_url}/leads/getCounselorLeadsCount`,
        { userId }
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // calculate total leads
  const totalLeads = data.reduce((acc, curr) => {
    return acc + curr.number_of_leads;
  }, 0);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Lead Performance Summary
        </h2>
        <h3 className="font-semibold mb-4">Total: {totalLeads}</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
};

export default Dashboard;
