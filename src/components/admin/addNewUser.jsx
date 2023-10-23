import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

function Register() {
  const [roles, setRoles] = useState([]);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const app_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    e.persist();
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        `${app_url}/datamanagement/getRoles`
      );
      setRoles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `${app_url}/auth/register`,
        inputs
      );
      swal("Success!", "User added successfully.", "success").then(() => {
        // Redirect to the /leads page after user clicks OK
        window.location.href = "/admin/users";
      });
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with an error status code (4xx or 5xx)
        if (err.response.status === 401) {
          // Handle invalid credentials error (status code 401)
          swal("Error", "Invalid credentials", "error");
        } else {
          // Handle other server errors with a general message
          swal("Error", "An error occurred. Please try again later.", "error");
        }
      } else if (err.request) {
        // The request was made but no response was received
        swal(
          "Error",
          "No response from the server. Please try again later.",
          "error"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        swal("Error", "An error occurred. Please try again later.", "error");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7">
              <h1 className="font-bold text-center text-2xl mb-5">
                Add New User
              </h1>
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={inputs.name}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                E-mail
              </label>
              <input
                type="text"
                name="email"
                value={inputs.email}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              />
              <label className="font-semibold text-sm text-gray-600 pb-1 block">
                User Role
              </label>
              <select
                type="text"
                name="role"
                value={inputs.role}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="">Select</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="py-5">
              <div className="flex justify-end">
                <div className="text-center sm:text-right  whitespace-nowrap">
                  <button
                    onClick={handleRegister}
                    className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 focus:shadow-sm focus:ring-4 focus:ring-blue-800 focus:ring-opacity-50 text-white text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                  >
                    <span className="inline-block mr-2">Register</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
