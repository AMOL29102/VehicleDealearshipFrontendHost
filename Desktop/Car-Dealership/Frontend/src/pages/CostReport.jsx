import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting the params from the URL
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { Maintainance } from "../components/Maintainance";
import Installment from "../components/Installment";

const CostReport = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [soldStatus, setSoldStatus] = useState();
  const [vehicleData, setvehicleData] = useState({
    buyingPrice: 12000,
    sellingPrice: 0,
    insuranceCommission: 500,
    maintenanceRecords: [],
    installments: [],
    carDetails: {
      carNo: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      model: "",
      color: "",
      type: "",
    },
    totalAmountToBePaid: 0,
    remainingAmount: 0,
  });
  // Form state for installments
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentDate, setInstallmentDate] = useState("");

  const [maintainanceData, setMaintainanceData] = useState({
    carDetails: { carNo: "" },
    maintenanceRecords: [],
    totalMaintenanceCost: 0,
  });

  function cleanURL(url) {
    // Use a regex to extract the correct URL
    const match = url.match(/https?:\/\/[^\s"']+/);
    return match ? match[0] : ""; // Return the first matched URL or an empty string
  }

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/car/${id}`);
        const { car, images, insurance, owner } = response.data;
        setSoldStatus(response.data.car.status);

        setvehicleData((prevData) => ({
          ...prevData,
          carDetails: {
            carNo: car.registernumber,
            ownerName: owner.ownername,
            ownerPhone: owner.ownerphone,
            ownerEmail: owner.owneremail,
            model: car.carname,
            color: car.carcolor,
            type: car.carmake,
            fuelType: car.fuel,
            carCompany: car.carcompany,
          },
        }));
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast.error("Failed to fetch car details.");
      }
    };

    fetchCarDetails();
  }, [id]);

  const fetchMaintenanceDetails = async () => {
    try {
      console.log("hi+" + id);
      const response = await axios.get("https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/maintainance", {
        params: { registernumber: id },
      });


      console.log("hi");

      if (response.status === 201) {
        return;
      }


      const { maintenanceRecords, totalmaintainance } = response.data;

      // Check if maintenanceRecords is an array before setting the state
      if (Array.isArray(maintenanceRecords)) {
        setMaintainanceData((prevData) => ({
          ...prevData,
          maintenanceRecords: maintenanceRecords,
          totalMaintenanceCost: Number(totalmaintainance),
        }));
      } else {
        toast.error("Invalid maintenance records format.");
      }
    } catch (error) {
      console.error("Error fetching maintenance details:", error);
      // toast.error("Failed to fetch maintenance details.");
    }
  };

  useEffect(() => {
    if (id) fetchMaintenanceDetails();
  }, [id]);

  const handleMaintenanceAdded = () => {
    fetchMaintenanceDetails(); // Refresh maintenance records after adding a new one
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex flex-col lg:flex-row p-5 bg-gray-100 min-h-[calc(100vh-80px)]">
        <div className="flex-1 p-5 bg-white shadow-lg rounded-lg mr-0 lg:mr-2 mb-4 lg:mb-0 ">
          <h2 className="text-2xl font-bold mb-4">
            Vehicle Pricing & Maintenance Report
          </h2>

          {/* Car Details */}
          {/* Car Details and Owner Details */}
          <div className="mb-4 p-4 bg-blue-200 text-blue-800 font-semibold rounded">
            <h3 className="text-xl">Car & Owner Details</h3>
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <h4 className="font-semibold">Car Details</h4>
                <p>Car No: {vehicleData.carDetails.carNo}</p>
                <p>Car Company: {vehicleData.carDetails.carCompany}</p>
                <p>Model: {vehicleData.carDetails.model}</p>
                {/* <p>Type: {vehicleData.carDetails.type}</p>
                <p>Fuel Type: {vehicleData.carDetails.fuelType}</p>
                <p>Color: {vehicleData.carDetails.color}</p> */}
              </div>
              <div className="w-1/2 pl-2">
                <h4 className="font-semibold">Owner Details</h4>
                <p>Owner: {vehicleData.carDetails.ownerName}</p>
                <p>Phone: {vehicleData.carDetails.ownerPhone}</p>
                <p>Email: {vehicleData.carDetails.ownerEmail}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Records */}
          <h3 className="text-lg font-semibold mb-2 ">Maintenance Records:</h3>
          <div className="overflow-y-auto max-h-60">
            {maintainanceData.maintenanceRecords.length > 0 ? (
              <ul className="mt-2">
                {maintainanceData.maintenanceRecords.map((record, index) => {


                  return (
                    <li
                      key={index}
                      className="mb-2 p-4 bg-yellow-200 text-yellow-800 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-black">
                          Type: {record.description}
                        </p>
                        <p>Cost: ₹{record.price}</p>
                        <p>
                          Date:{" "}
                          {new Date(
                            record.maintainanceDate
                          ).toLocaleDateString()}
                        </p>
                        <p>Done By: {record.role}</p>
                        <p>
                          Receipt:{" "}
                          <a
                            href={record.maintainanceReceipt}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Receipt
                          </a>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No maintenance records available.</p>
            )}
          </div>

          {/* Total Maintenance Cost */}
          <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 font-semibold rounded">
            <h3 className="text-lg">
              Total Maintenance Cost: ₹{maintainanceData.totalMaintenanceCost}
            </h3>
          </div>

          {/* Insurance Commission */}
          {/* <div className="mt-4 p-4 bg-orange-200 text-orange-800 font-semibold rounded">
            <h3 className="text-lg">Insurance Commission: ₹{vehicleData.insuranceCommission}</h3>
          </div> */}

          {/* Net Profit */}
          {/* <div className="mt-4 p-4 bg-green-200 text-green-800 font-semibold rounded">
            <h3 className="text-lg">Net Profit: ₹{netProfit}</h3>
          </div> */}
        </div>

        {/* Form Section */}
        <div className="flex-1 p-5 bg-white shadow-lg rounded-lg">
          {soldStatus === false ? (
            <Maintainance registernumber={id} onMaintenanceAdded={handleMaintenanceAdded} />
          ) : (
            <Installment carID={id} />
          )}

          {/* <h2 className="text-2xl font-bold mt-6 mb-4">Set Total Amount to be Paid</h2>
          <form onSubmit={handleTotalAmountSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Total Amount</label>
              <input
                type="number"
                value={totalAmountToBePaid} 
                onChange={(e) => setTotalAmountToBePaid(e.target.value)}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-purple-500 text-white p-2 rounded">
              Set Total Amount
            </button>
          </form> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CostReport;