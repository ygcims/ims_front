import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SearchBarCounselor } from "../components/searchBar";

function NewLeads({ id }) {
  const [leads, setLeads] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const app_url = import.meta.env.VITE_API_URL;

  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    status: "",
    source: "",
    course: "",
  });

  useEffect(() => {
    fetchCounselorNewLeads();
  }, [id, searchParams]);

  const fetchCounselorNewLeads = async () => {
    try {
      const res = await axios.post(
        `${app_url}/leads/getCounselorNewLeads`,
        { id }
      );
      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowSelect = (leadId) => {
    if (selectedRows.includes(leadId)) {
      setSelectedRows(selectedRows.filter((id) => id !== leadId));
    } else {
      setSelectedRows([...selectedRows, leadId]);
    }
  };

  useEffect(() => {
    // Apply filters to leads after fetching them
    applyFilters(leads);
  }, [leads, searchParams, searchInput]);

  const applyFilters = (leadsData) => {
    const filtered = leadsData.filter((lead) => {
      const leadDate = new Date(lead.date);
      const formattedLeadDate = leadDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      const startDateMatch =
        !searchParams.startDate || leadDate >= new Date(searchParams.startDate);
      const endDateMatch =
        !searchParams.endDate || leadDate <= new Date(searchParams.endDate);

      const statusMatch =
        !searchParams.status || lead.statusid === parseInt(searchParams.status);
      const sourceMatch =
        !searchParams.source ||
        lead.source_id === parseInt(searchParams.source);
      const courseMatch =
        !searchParams.course ||
        lead.course_id === parseInt(searchParams.course);

      const searchMatch =
        (lead.nic &&
          lead.nic.toLowerCase().includes(searchInput.toLowerCase())) ||
        (lead.name &&
          lead.name.toLowerCase().includes(searchInput.toLowerCase())) ||
        (lead.mobile1 && lead.mobile1.includes(searchInput)) ||
        (lead.mobile2 && lead.mobile2.includes(searchInput));

      return (
        startDateMatch &&
        endDateMatch &&
        statusMatch &&
        sourceMatch &&
        courseMatch &&
        searchMatch
      );
    });

    setFilteredLeads(filtered);
  };

  const handleSearchParamsChange = (updatedParams) => {
    setSearchParams(updatedParams);
    setSearchInput("");
    applyFilters(leads);
  };

  return (
    <div className="pb-16">
      <SearchBarCounselor
        onChange={handleSearchParamsChange}
        {...searchParams}
      />
      <div className="bg-white shadow-md rounded p-5 pb-3 pt-0 flex flex-col my-2">
        <div className="flex flex-row justify-between">
          <div className="w-2/8 pt-5 px-3">
            <div className="relative mx-auto w-max">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-gray-500 focus:pl-16 focus:pr-4"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-gray-300 peer-focus:stroke-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container overflow-y-auto">
        <table className="min-w-full w-10 border-collapse md:table">
          <thead className="md:table-header-group">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell"></th>
              <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
                Id
              </th>
              <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
                Date
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
          <tbody className="md:table-row-group overflow-y-auto">
            {filteredLeads.map((lead) => (
              <tr
                key={lead.lead_id}
                className={`bg-gray-100 hover:bg-white border border-grey-500 md:border-none block md:table-row ${
                  selectedRows.includes(lead.lead_id) ? "bg-blue-200" : ""
                }`}
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(lead.lead_id)}
                    onChange={() => handleRowSelect(lead.lead_id)}
                  />
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.lead_id}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {new Date(lead.date).toLocaleDateString()}
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
    </div>
  );
}

export default NewLeads;
