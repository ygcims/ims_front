import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/getUsers`
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div class="w-full max-w-2xl my-10 mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
        <div className="flex flex-row justify-between ">
          <header class="px-5 py-4 border-b border-gray-100">
            <h2 class="font-semibold text-gray-800">Users</h2>
          </header>
          <Link
            className="bg-blue-900 hover:bg-blue-800 text-white rounded m-5 p-3"
            to="/admin/users/addNewUser"
          >
            Add New User
          </Link>
        </div>

        <div class="p-3">
          <div class="overflow-x-auto">
            <table class="table-auto w-full">
              <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                <tr>
                  <th class="p-2 whitespace-nowrap">
                    <div class="font-semibold text-left">id</div>
                  </th>
                  <th class="p-2 whitespace-nowrap">
                    <div class="font-semibold text-left">name</div>
                  </th>
                  <th class="p-2 whitespace-nowrap">
                    <div class="font-semibold text-left">email</div>
                  </th>
                  <th class="p-2 whitespace-nowrap">
                    <div class="font-semibold text-left">role</div>
                  </th>
                  <th class="p-2 whitespace-nowrap">
                    <div class="font-semibold text-center">roster</div>
                  </th>
                </tr>
              </thead>
              <tbody class="text-sm divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td class="p-2 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="font-medium text-gray-800">{user.id}</div>
                      </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                      <div class="text-left">{user.name}</div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                      <div class="text-left font-medium text-blue-500">
                      {user.email}
                      </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                      <div class="text-md text-left">{user.roleName}</div>
                    </td>
                    <td class="p-2 text-center whitespace-nowrap">
                      <Link
                        to={`/users/roster/${user.id}`}
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
  );
}

export default Users;
