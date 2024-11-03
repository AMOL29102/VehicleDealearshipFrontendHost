import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function DriverDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);






    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

      

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
                                Driver Dashboard
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
                    <h2 className="text-2xl font-bold">Driver Dashboard</h2>
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
                <NavLink className="text-gray-600 font-semibold" to="/dashboard/driver/onsiteVehicleImages">
                    <div className="bg-purple-500 p-5 rounded text-white min-h-4">
                        Add Onsite Vehicle Images
                    </div>
                </NavLink>
                    <div className="bg-blue-500 p-5 rounded text-white min-h-4">
                        Sample Card2
                    </div>
                    <div className="bg-orange-500 p-5 rounded text-white min-h-4">
                        Sample Card3
                    </div>
                </div>
            </div>
        </div>
    );
}