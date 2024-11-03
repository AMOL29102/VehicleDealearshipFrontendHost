import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [carDetails, setCarDetails] = useState([]);
  const { query, setQuery } = useContext(SearchContext);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleView = (url) => {
    navigate(`/costReport/${url}`)
  }

  const handleSearchInputChange = (e) => {
    // console.log(e.target.value)
    setQuery(e.target.value);

  };

  // Fetch car details from the API
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const params = {};
        if (query) params.carSearch = query;
        // console.log(params)
        const response = await axios.get(`https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/dashboard`, { params });
        // console.log(response);
        setCarDetails(response.data); // Assuming the response contains an array of car details
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [query]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col lg:flex-row">
      <div
        className={`${isSidebarOpen ? 'block' : 'hidden'
          } lg:block bg-white w-64 p-5 fixed lg:relative z-20`}
      >
        <div className="lg:hidden mb-5">
          <button
            onClick={toggleSidebar}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close Menu
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-5">
          <img
            className="w-10 h-10 rounded-full"
            src="https://via.placeholder.com/40"
            alt="Profile"
          />
          <div>
            <h3 className="font-semibold">Nikhil Motors</h3>
            <span className="text-gray-500">Admin</span>
          </div>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <NavLink className="text-blue-500 font-semibold" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink className="text-gray-600 font-semibold" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="text-gray-600 font-semibold" to="/about">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="min-h-[2px] mt-10 bg-black"></div>
        <NavLink to={'/dashboard/carDetailsForm'}>
          <button className="mt-10 bg-blue-500 text-white w-36 px-7 py-2 rounded hover:bg-blue-600">
            Add Vehicle
          </button>
        </NavLink>

        <NavLink to={'/dashboard/deleteCarDetails'}>
          <button className="mt-10 bg-red-500 text-white w-36 px-4 py-2 rounded hover:bg-red-600">
            Remove Vehicle
          </button>
        </NavLink>

        <NavLink to={'/dashboard/addNoticeImage'}>
          <button className="mt-10 bg-yellow-500 text-white w-36 px-4 py-2 rounded hover:bg-yellow-600">
            Add Notice
          </button>
        </NavLink>

        <NavLink to={'/dashboard/sellCarDetails'}>
          <button className="mt-10 bg-blue-500 text-white w-36 px-4 py-2 rounded hover:bg-blue-600">
            Sell Car
          </button>
        </NavLink>

        <div className="min-h-[2px] mt-10 bg-black"></div>
        <NavLink to={'/dashboard/customerEnquiry'}>
          <button className="mt-10 bg-green-500 text-white w-36 px-10 py-2 rounded hover:bg-green-600">
            Enquiry
          </button>
        </NavLink>
      </div>

      <div className="lg:hidden p-5">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      <div className="flex-1 p-5 lg:p-10">
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src="https://via.placeholder.com/40"
              alt="Profile"
            />
            <span>Nikhil Motors</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <div className="bg-purple-300 p-5 rounded text-white min-h-4">
            Sample Card1
          </div>
          <div className="bg-blue-300 p-5 rounded text-white min-h-4">
            Sample Card2
          </div>
          <div className="bg-orange-300 p-5 rounded text-white min-h-4">
            Sample Card3
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-3">Car Details</h3>

          {/* search section */}
          <div className="relative mx-auto w-full max-w-md ml-0 mb-4">
            <input
              type="text"
              className="w-full h-8 pl-10 pr-4 py-2 border border-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              placeholder="Search..."
              value={query}
              onChange={handleSearchInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M18.4 10.55a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
            </div>
          </div>




          <table className="w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="p-2">Owner Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Car Make</th>
                <th className="p-2">Car Name</th>
                <th className="p-2">Register No</th>
                <th className="p-2">Status</th>
                <th className="p-2">View</th>

              </tr>
            </thead>
            <tbody>
              {carDetails.map((car, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{car.ownername}</td>
                  <td className="p-2">{car.owneremail}</td>
                  <td className="p-2">{car.ownerphone}</td>
                  <td className="p-2">{car.carmake}</td>
                  <td className="p-2">{car.carname}</td>
                  <td className="p-2">{car.registernumber}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${car.status === true
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {car.status === true ? "sold" : "Available"}
                    </span>
                  </td>
                  <td className="p-2"><button onClick={() => handleView(car.registernumber)}><i className={'fas fa-eye'}></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
