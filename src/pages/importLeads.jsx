import { useEffect, useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import axios from "axios";
import swal from "sweetalert";
import { SearchBarCounselor } from "../components/searchBar";

function ImportLeads({ userRole, userId }) {
  const [leads, setLeads] = useState([]);
  const [header, setHeader] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStatuses();
    fetchCources();
    fetchSources();
    console.log(userId);
    if (userRole == 2) {
      fetchCounselors();
    }
  }, []);

  const handleToggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(leads);
      console.log("Selected all leads:", leads);
    } else {
      setSelectedRows([]);
      console.log("Deselected all leads.");
    }
  };

  const handleRowSelect = (lead) => {
    if (selectedRows.some((row) => row.email === lead.email)) {
      setSelectedRows((prevRows) =>
        prevRows.filter((row) => row.email !== lead.email)
      );
    } else {
      setSelectedRows((prevRows) => [...prevRows, lead]);
      console.log([...selectedRows, lead]); // Log the updated state immediately
    }
  };

  const handleAssignto = async (e) => {
    let courseIDs = [];
    let sourceIDs = [];
    const leadDetails = [];
    let selectedCounselorId;
    if (userRole == 3) {
      selectedCounselorId = userId;
    } else {
      selectedCounselorId = e.target.value;
    }
    const selectedName = e.target.options[e.target.selectedIndex].text;

    const status = statuses.find(
      (status) => status.name.toLowerCase() === "new"
    );
    const statusId = status.id;

    const matchingLeads = selectedRows.filter((lead) => {
      const matchingCourse = courses.find(
        (course) => course.name.toLowerCase() === lead.course_name.toLowerCase()
      );
      return matchingCourse !== undefined;
    });

    const unmatchedLeads = selectedRows.filter((lead) => {
      const matchingCourse = courses.find(
        (course) => course.name.toLowerCase() === lead.course_name.toLowerCase()
      );
      return matchingCourse === undefined;
    });

    const matchingSources = selectedRows.filter((lead) => {
      const matchingSource = sources.find(
        (source) => source.name.toLowerCase() === lead.source_name.toLowerCase()
      );
      return matchingSource !== undefined;
    });

    const unmatchedSources = selectedRows.filter((lead) => {
      const matchingSource = sources.find(
        (source) => source.name.toLowerCase() === lead.source_name.toLowerCase()
      );
      return matchingSource === undefined;
    });

    const otherCourse = courses.find(
      (course) => course.name.toLowerCase() === "other"
    );
    const otherCourseId = otherCourse ? otherCourse.id : null;

    const otherSource = sources.find(
      (source) => source.name.toLowerCase() === "other"
    );
    const otherSourceId = otherSource ? otherSource.id : null;

    const matchingCourseIds = matchingLeads.map((lead) => {
      const matchingCourse = courses.find(
        (course) => course.name.toLowerCase() === lead.course_name.toLowerCase()
      );
      return matchingCourse.id;
    });

    const matchingSourceIds = matchingSources.map((lead) => {
      const matchingSource = sources.find(
        (source) => source.name.toLowerCase() === lead.source_name.toLowerCase()
      );
      return matchingSource.id;
    });

    let shouldProceed = true;

    if (unmatchedLeads.length > 0 || unmatchedSources.length > 0) {
      try {
        const response = await swal(
          `The following leads have no matching courses or sources:\n${[
            ...unmatchedLeads,
            ...unmatchedSources,
          ]
            .map(
              (lead) =>
                `${lead.name} - ${lead.course_name} - ${lead.source_name}`
            )
            .join("\n")}\nDo you want to proceed them as other category?`,
          {
            buttons: ["No!", "Yes!"],
          }
        );

        if (!response) {
          shouldProceed = false; // Set to false if the user cancels the assignment
          console.log("Assignment canceled.");
        } else {
          if (unmatchedLeads.length > 0) {
            courseIDs.push(otherCourseId); // Add otherCourseId to the array
          }
          if (unmatchedSources.length > 0) {
            sourceIDs.push(otherSourceId); // Add otherSourceId to the array
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (
      shouldProceed &&
      matchingCourseIds.length > 0 &&
      matchingSourceIds.length > 0
    ) {
      try {
        const response = await swal(
          `Do you want to assign these leads to ${selectedName}?`,
          {
            buttons: ["No!", "Yes!"],
          }
        );

        if (!response) {
          shouldProceed = false; // Set to false if the user cancels the assignment
          console.log("Assignment canceled.");
        } else {
          courseIDs = courseIDs.concat(matchingCourseIds); // Add matchingCourseIds to the array
          sourceIDs = sourceIDs.concat(matchingSourceIds); // Add matchingSourceIds to the array
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (shouldProceed) {
      // Populate leadDetails array with unmatched leads (wrong courses)
      unmatchedLeads.forEach((lead) => {
        const matchingCourse = courses.find(
          (course) =>
            course.name.toLowerCase() === lead.course_name.toLowerCase()
        );
        const matchingSource = sources.find(
          (source) =>
            source.name.toLowerCase() === lead.source_name.toLowerCase()
        );

        // Create a lead detail object and push it to the leadDetails array
        leadDetails.push({
          date: lead.date,
          name: lead.name,
          mobile1: lead.mobile1,
          mobile2: lead.mobile2,
          course: matchingCourse ? matchingCourse.id : otherCourseId,
          source: matchingSource ? matchingSource.id : otherSourceId,
          address: lead.address,
          email: lead.email,
          comment: lead.comment,
          assignto: selectedCounselorId,
          status: statusId,
        });
      });

      // Populate leadDetails array with matching leads and sources
      matchingLeads.forEach((lead) => {
        const matchingCourse = courses.find(
          (course) =>
            course.name.toLowerCase() === lead.course_name.toLowerCase()
        );
        const matchingSource = sources.find(
          (source) =>
            source.name.toLowerCase() === lead.source_name.toLowerCase()
        );

        // Create a lead detail object and push it to the leadDetails array
        leadDetails.push({
          date: lead.date,
          name: lead.name,
          mobile1: lead.mobile1,
          mobile2: lead.mobile2,
          course: matchingCourse ? matchingCourse.id : otherCourseId,
          source: matchingSource ? matchingSource.id : otherSourceId,
          address: lead.address,
          email: lead.email,
          comment: lead.comment,
          assignto: selectedCounselorId,
          status: statusId,
        });
      });

      // send data to the database
      if (leadDetails.length > 0) {
        try {
          const res = await axios.post(
            `${app_url}/datamanagement/addImportedLead`,
            leadDetails
          );
          console.log(leadDetails);

          swal("Success!", "Lead added successfully.", "success");
          const remainingLeads = leads.filter(
            (lead) => !leadDetails.some((assigned) => assigned.email === lead.email)
          );
          setLeads(remainingLeads);
        } catch (err) {
          console.log(err);

          // Show an error Swal message
          swal("Error!", "An error occurred while adding the lead.", "error");
        }
      }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const header = resp.rows[0];
        setHeader(header);
        const leads = resp.rows.slice(1).map((row) => ({
          date: convertExcelDateToMySQLDatetime(row[0]),
          name: row[1],
          mobile1: row[2],
          mobile2: row[3],
          course_name: row[4],
          source_name: row[5],
          address: row[6],
          email: row[7],
          comment: row[8],
        }));
        console.log(leads);
        setLeads(leads);
      }
    });
  };

  const convertExcelDateToMySQLDatetime = (excelDate) => {
    const excelSerialDate = parseFloat(excelDate);
    const unixTimestamp = (excelSerialDate - 25569) * 86400; // Convert Excel serial date to Unix timestamp
    const mysqlDatetime = new Date(unixTimestamp * 1000) // Convert Unix timestamp to JavaScript Date object
      .toISOString()
      .slice(0, 19) // (YYYY-MM-DDTHH:mm:ss)
      .replace("T", " ");

    return mysqlDatetime;
  };

  return (
    <div className="pb-16">
      <div className="bg-white shadow-md rounded p-8 pb-2 pt-0 flex flex-col my-2">
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/5 px-3 mb-6 md:mb-0">
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
                {userRole === 2 ? (
                  <>
                    {counselors.map((counselor) => (
                      <option key={counselor.id} value={counselor.id}>
                        {counselor.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value={userId}>Me</option>
                )}
              </select>
            </div>
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0 flex justify-end items-center">
            <input type="file" onChange={handleFileChange}></input>
          </div>
        </div>
      </div>

      <div className="table-container overflow-y-auto">
        <table className="min-w-full w-10 border-collapse md:table">
          <thead className="md:table-header-group">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleToggleSelectAll}
                />
              </th>
              {header.map((head) => (
                <th
                  key={head}
                  className="bg-blue-900 p-2 text-white md:border md:border-grey-500 text-center block md:table-cell"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="md:table-row-group overflow-y-auto">
            {leads.map((lead) => (
              <tr
                key={lead.email}
                className={`bg-gray-100 hover:bg-white border border-grey-500 md:border-none block md:table-row ${
                  selectedRows.includes(lead.lead_id) ? "bg-blue-200" : ""
                }`}
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <input
                    type="checkbox"
                    checked={selectedRows.some(
                      (row) => row.email === lead.email
                    )}
                    onChange={() => handleRowSelect(lead)}
                  />
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.date}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.name}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.mobile1}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.mobile2}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.course_name}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.source_name}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.address}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.email}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  {lead.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImportLeads;
