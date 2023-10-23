import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom if applicable

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img
        src="https://cdn-icons-png.flaticon.com/128/7486/7486803.png"
        alt="Page Not Found"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-4xl md:text-6xl font-semibold text-blue-900 mb-2">
        Oops!
      </h1>
      <h2 className="text-2xl md:text-4xl font-semibold mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        The requested page could not be found. Please check the URL or return to
        the{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          dashboard
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFoundPage;
