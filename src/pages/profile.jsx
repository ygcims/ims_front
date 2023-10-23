import React, { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import swal from "sweetalert";

const ProfilePage = ({ user }) => {
  const app_url = import.meta.env.VITE_API_URL;
  let userRole;
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    currentPassword: "",
    password: "",
    rePassword: "",
    profileImage: null, // Store the image file directly
    roleid: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        roleid: user.roleid,
        currentPassword: "",
        password: "",
        rePassword: "",
      });
    }
  }, [user]);

  // change userRole according to the roleid
  switch (userData.roleid) {
    case 1:
      userRole = "Admin";
      break;
    case 2:
      userRole = "Manager";
      break;
    case 3:
      userRole = "Student Counselor";
      break;
    default:
      break;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set the canvas dimensions to the original image size
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image on the canvas without resizing
        ctx.drawImage(img, 0, 0, img.width, img.height);
  
        // Get the compressed image data from the canvas as a base64 string
        const compressedImageData = canvas.toDataURL("image/jpeg"); // You can change the format if needed
  
        setUserData((prevData) => ({
          ...prevData,
          profileImage: compressedImageData, // Store the compressed image data
        }));
      };
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clone the userData object to avoid modifying the original object
    const updatedUserData = { ...userData };

    // Remove empty fields by setting them to null
    for (const key in updatedUserData) {
      if (updatedUserData[key] === "") {
        updatedUserData[key] = null;
      }
    }

    for (const key in userData) {
      if (userData[key] === "") {
        userData[key] = null;
      }
    }

    let requiredFields = ["id", "name", "email"];

    if (updatedUserData.currentPassword) {
      requiredFields = [
        ...requiredFields,
        "currentPassword",
        "password",
        "rePassword",
      ];
    } else {
      requiredFields = [...requiredFields, "profileImage"];
    }

    if (requiredFields.some((field) => !updatedUserData[field])) {
      swal("Error", "Please fill all the fields.", "error");
      return;
    } else {
      if (updatedUserData.currentPassword) {
        // Compare the provided currentPassword with the encrypted user password
        const isPasswordMatch = await bcrypt.compare(
          updatedUserData.currentPassword,
          user.password
        );

        if (!isPasswordMatch) {
          swal("Error", "Current password does not match.", "error");
          return;
        }
      }

      if (updatedUserData.password !== updatedUserData.rePassword) {
        swal("Error", "Passwords do not match.", "error");
        return;
      }

      if (updatedUserData.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          updatedUserData.password,
          saltRounds
        );
        updatedUserData.password = hashedPassword;
      }

      // Update local storage user data (only non-sensitive information)
      const updatedUser = { ...user, ...updatedUserData };

      try {
        const res = await axios.post(
          `${app_url}/auth/update-profile`,
          userData
        );
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log(res.data);

        swal("Success", "Profile updated successfully.", "success").then(() => {
          window.location.href = "/dashboard";
        });

        // reset data fields
        setUserData((prevData) => ({
          ...prevData,
          currentPassword: "",
          password: "",
          rePassword: "",
        }));
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          // Display validation errors in a suitable format
          const errorMessages = error.response.data.errors.join("\n");
          swal("Validation Error", errorMessages, "error");
        } else {
          swal(
            "Error!",
            "An error occurred while updating the profile.",
            "error"
          );
        }
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div className="w-1/2 bg-blue-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-semibold">{userData.name}</h1>
        {userData.profileImage ? (
          <img
            src={userData.profileImage} // Use the base64 data directly
            alt="Profile"
            className="mt-4 w-40 h-40 rounded-full"
          />
        ) : (
          <img
            src="/images/user.png"
            alt="Default Profile"
            className="mt-4 w-40 h-40 rounded-full"
          />
        )}

        <span className="mt-4">{userRole}</span>
      </div>

      <div className="w-1/2 bg-gray-100 p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <div className="ml-4 mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500"
            >
              Name
            </label>
            <input
              type="text"
              disabled
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <div className="ml-4 mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              disabled
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <div className="mt-12 mb-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-black"
            >
              CHANGE PASSWORD
            </label>
          </div>
          <div className="ml-4 mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={userData.currentPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <div className="ml-4 mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <div className="ml-4 mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500"
            >
              Re - type new password
            </label>
            <input
              type="password"
              name="rePassword"
              value={userData.rePassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-500"
            >
              Change Profile Image (max. 30kb)
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleImageChange}
              className="mt-1 p-2 w-full rounded-md border-gray-300 focus:ring focus:ring-blue-300 focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
