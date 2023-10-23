import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [courses, setCourses] = useState([]);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [batches, setBatches] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  const menuList = [
    { name: "Course", link: "#courses" },
    { name: "Source", link: "#sources" },
    { name: "Status", link: "#statuses" },
    { name: "Batch", link: "#batches" },
  ];

  useEffect(() => {
    fetchCourses();
    fetchSources();
    fetchStatuses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
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

  const fetchBatches = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/batches`
      );
      setBatches(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex">
        {/* Sub Navigation Bar */}
        <div className="bg-gray-100 w-1/4 fixed pl-4 my-7">
          <div className="flex flex-row">
            {menuList.map((item, index) => (
              <a
                key={item.name}
                href={item.link}
                className="text-sm hover:bg-gray-200 lowercase hover:font-bold text-gray-800 p-3 px-2 mr-10 rounded"
              >
                {item.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto">
          {/* courses */}
          <div
            id="courses"
            className="w-full max-w-2xl my-12 mx-auto bg-white shadow-lg rounded-sm border border-gray-200"
          >
            <div className="flex flex-row justify-between ">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Courses</h2>
              </header>
              <Link
                className="bg-blue-900 hover:bg-blue-800 text-white rounded m-5 p-3"
                to="/admin/data/addNewCourse"
              >
                Add New Course
              </Link>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">id</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          description
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">action</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800">
                              {course.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{course.name}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">
                            {course.description}
                          </div>
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          <Link
                            to={`/data/addNewCourse/${course.id}`}
                            className="text-m bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded text-center"
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
          </div>

          {/* sources */}
          <div
            id="sources"
            className="w-full max-w-2xl my-12 mx-auto bg-white shadow-lg rounded-sm border border-gray-200"
          >
            <div className="flex flex-row justify-between ">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Sources</h2>
              </header>
              <Link
                className="bg-blue-900 hover:bg-blue-800 text-white rounded m-5 p-3"
                to="/admin/data/addNewSource"
              >
                Add New Source
              </Link>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">id</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">action</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {sources.map((source) => (
                      <tr key={source.id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800">
                              {source.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{source.name}</div>
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          <Link
                            to={`/data/addNewSource/${source.id}`}
                            className="text-m bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded text-center"
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
          </div>

          {/* statuses */}
          <div
            id="statuses"
            className="w-full max-w-2xl my-12 mx-auto bg-white shadow-lg rounded-sm border border-gray-200"
          >
            <div className="flex flex-row justify-between ">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Statuses</h2>
              </header>
              <Link
                className="bg-blue-900 hover:bg-blue-800 text-white rounded m-5 p-3"
                to="/admin/data/addNewStatus"
              >
                Add New Status
              </Link>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">id</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">action</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {statuses.map((status) => (
                      <tr key={status.id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800">
                              {status.id}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{status.name}</div>
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          <Link
                            to={`/data/addNewStatus/${status.id}`}
                            className="text-m bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded text-center"
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
          </div>

          {/* batches */}
          <div
            id="batches"
            className="w-full max-w-2xl my-12 mx-auto bg-white shadow-lg rounded-sm border border-gray-200"
          >
            <div className="flex flex-row justify-between ">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Batches</h2>
              </header>
              <Link
                className="bg-blue-900 hover:bg-blue-800 text-white rounded m-5 p-3"
                to="/admin/data/addNewBatch"
              >
                Add New Batch
              </Link>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">code</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">course id</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          orientation date
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          commencement date
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          description
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">fee (lkr)</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">action</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {batches.map((batch) => (
                      <tr key={batch.code}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800">
                              {batch.code}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{batch.course_id}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {
                            new Date(batch.orientation_date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {
                            new Date(batch.commencement_date)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{batch.description}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{batch.fee}</div>
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          <Link
                            to={`/data/addNewBatch/${batch.code}`}
                            className="text-m bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded text-center"
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
