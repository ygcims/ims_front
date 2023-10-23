import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { SearchBarCounselor } from "../components/searchBar";

function ManageLeads({ userRole, id }) {
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [counselors, setCounselors] = useState([]);
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
    fetchLeads();
    if (id) {
      fetchCounselorLeads();
    } else {
      fetchCounselors();
    }
  }, [id, searchParams]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${app_url}/leads/dispalyleads`
      );
      if (id) {
        setAllLeads(res.data);
      } else {
        setLeads(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCounselorLeads = async () => {
    try {
      const res = await axios.post(
        `${app_url}/leads/dispalyCounselorleads`,
        { id }
      );
      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Apply filters to leads after fetching them
    applyFilters(leads);
    applySearchFilters(allLeads);
  }, [leads, searchParams, searchInput]);

  const applyFilters = (leadsData) => {
    const filtered = leadsData.filter((lead) => {
      const leadDate = new Date(lead.date);

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
        (lead.passport &&
          lead.passport.toLowerCase().includes(searchInput.toLowerCase())) ||
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

  const applySearchFilters = (allLeadsData) => {
    const searched = allLeadsData.filter((lead) => {
      const searchMatch =
        (lead.nic &&
          lead.nic.toLowerCase().includes(searchInput.toLowerCase())) ||
        (lead.passport &&
          lead.passport.toLowerCase().includes(searchInput.toLowerCase())) ||
        (lead.name &&
          lead.name.toLowerCase().includes(searchInput.toLowerCase())) ||
        (lead.mobile1 && lead.mobile1.includes(searchInput)) ||
        (lead.mobile2 && lead.mobile2.includes(searchInput));

      return searchMatch;
    });

    if (searched.length === 1) {
      const lead = searched[0];
      const message =
        "Found result:\n" +
        `Student Name: ${lead.name}\n` +
        `Counselor: ${lead.username}\n` +
        `Course: ${lead.course_name}\n` +
        `NIC: ${lead.nic}\n` +
        `Mobile 1: ${lead.mobile1}\n` +
        `Mobile 2: ${lead.mobile2}\n` +
        `Passport: ${lead.passport}\n` +
        `Status: ${lead.status_name}`;

      swal({
        text: message,
        icon: "success",
        buttons: {
          close: {
            text: "Close",
            value: null,
          },
        },
      });
    }
  };

  const handleRowSelect = (leadId) => {
    if (selectedRows.includes(leadId)) {
      setSelectedRows(selectedRows.filter((id) => id !== leadId));
    } else {
      setSelectedRows([...selectedRows, leadId]);
    }
  };

  const handleAssignto = async (e) => {
    const selectedCounselorId = e.target.value;
    try {
      const res = await axios.post(`${app_url}/leads/assignto`, {
        selectedRows,
        selectedCounselorId,
      });
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    console.log(selectedRows, selectedCounselorId);
  };

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/counselors`
      );
      setCounselors(res.data);
    } catch (error) {
      console.log(error);
    }
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
          {userRole === 2 && (
            <div className="w-1/5 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Assign To
              </label>
              <div className="relative">
                <select
                  onChange={(e) => handleAssignto(e)}
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
            </div>
          )}
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

export default ManageLeads;
