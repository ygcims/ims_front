import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function TodayLeads({ id }) {
  const [leads, setLeads] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCounselorLeads();
  }, []);

  const fetchCounselorLeads = async () => {
    try {
      const res = await axios.post(
        `${app_url}/leads/getTodayLeads`,
        { id }
      );
      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pb-16">
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Id
            </th>
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Name
            </th>
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Mobile
            </th>
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Course
            </th>
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Status
            </th>
            {!id && (
              <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
                Counselor
              </th>
            )}
            <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {leads.map((lead) => (
            <tr
              key={lead.lead_id}
              className="bg-gray-100 hover:bg-white border border-grey-500 md:border-none block md:table-row"
            >
              <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                {lead.lead_id}
              </td>
              <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                {lead.name}
              </td>
              <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                {lead.mobile1}
              </td>
              <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                {lead.course_name}
              </td>
              <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                {lead.status_name}
              </td>
              {!id && (
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.username}
                </td>
              )}
              <td className="p-2 md:border md:border-grey-500 text-center block md:table-cell">
                <Link
                  to={`/leads/updateLead/${lead.lead_id}`}
                  className="bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodayLeads;
