import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Installment({ carID }) {
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentDate, setInstallmentDate] = useState("");
  const [carDetails, setCarDetails] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [error, setError] = useState(null);
  const [viewOption, setViewOption] = useState("view");
  const [loading, setLoading] = useState(true); // Loading state
  const [insuranceDoc, setInsuranceDoc] = useState([]);
  const [soldCarImages, setSoldCarImages] = useState([]);




  const fetchCarDetails = async () => {
    try {
      console.log("Params : " + carID);
      const response = await axios.get(
        `https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/dashboard/sold-cars`, // Update to your actual endpoint
        { params: { carID } }
      );
      setCarDetails(response.data.dbData);
      setInsuranceDoc(response.data.soldCarInsuranceDocs);

      setSoldCarImages(response.data.soldCarImages);
    } catch (err) {
      // setError("Error fetching car details");
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const fetchInstallments = async () => {
    if (!carID) return;
    try {
      const response = await axios.get(
        `https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/installments`,
        { params: { registernumber: carID } }
      );
      setInstallments(response.data);
    } catch (err) {
      // setError("Error fetching installment details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/installments", {
        registernumber: carID,
        amount: installmentAmount,
        installmentdate: installmentDate,
      });

      if (response.status === 200) {
        toast.success("Installment added successfully");
        setInstallmentAmount("");
        setInstallmentDate("");
        setViewOption("view");
        // Optionally fetch installments again
        fetchInstallments();
      }
    } catch (error) {
      toast.error("Failed to add installment. Please try again.");
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalInstallmentAmount = installments.reduce((total, inst) => total + parseFloat(inst.amount), 0);

  if (carID) {
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true); // Start loading
        try {
          await fetchInstallments(); // Fetch installments
          await fetchCarDetails(); // Fetch car details
        } catch (err) {
          console.error('Error fetching data:', err.response ? err.response.data : err.message);
          setError("Error fetching data");
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchData();
      console.log(insuranceDoc);
    }, [carID]);
  }

  return (
    <>

      <div className="bg-white p-2 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Sold Vehicle Details</h2>
        {error && <p className="text-red-500">{error}</p>}
        {loading ? ( // Show loading state
          <p>Loading...</p>
        ) : carDetails.length > 0 ? (
          carDetails.map((car) => (
            <div
              key={car.registernumber}
              className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{car.owner_name}</h3>
                <p>
                  <span className="font-medium">Selling Price:</span>{" "}
                  {car.selling_price}
                </p>
                <p>
                  <span className="font-medium">Contact No:</span>{" "}
                  {car.contact_no}
                </p>
                <p>
                  <span className="font-medium">Commission:</span>{" "}
                  {car.commission}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Insurance Document:</span>{" "}
                  {insuranceDoc.length > 0 ? (
                    <button
                      onClick={() =>
                        insuranceDoc.forEach((doc) => window.open(doc, "_blank", "noopener,noreferrer"))
                      }
                      className="text-blue-500 underline"
                    >
                      View
                    </button>
                  ) : (
                    "Not Provided"
                  )}
                </p>
                <p>
                  <span className="font-medium">Sold Car Images:</span>{" "}
                  {soldCarImages.length > 0 ? (
                    <button
                      onClick={() =>
                        soldCarImages.forEach((doc) => window.open(doc, "_blank", "noopener,noreferrer"))
                      }
                      className="text-blue-500 underline"
                    >
                      View
                    </button>
                  ) : (
                    "Not Provided"
                  )}
                </p>

              </div>
            </div>
          ))
        ) : (
          <p>No car details available</p>
        )}
      </div>

      <div className="mt-6">
        <label className="mr-4">
          <input
            type="radio"
            value="view"
            checked={viewOption === "view"}
            onChange={() => setViewOption("view")}
          />
          <span className="ml-2">View Installments</span>
        </label>
        <label className="ml-6">
          <input
            type="radio"
            value="add"
            checked={viewOption === "add"}
            onChange={() => setViewOption("add")}
          />
          <span className="ml-2">Add Installment</span>
        </label>
      </div>

      {viewOption === "view" && (
        <>
          <div className="bg-white pt-2 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold p-2">Installment Details</h2>
            <div className="max-h-60 overflow-y-auto">
              {installments.length > 0 ? (
                installments.map((inst, index) => (
                  <div key={index} className="p-4 border-b border-gray-200 flex items-center">
                    <span className="font-medium mr-2">{index + 1})</span>
                    <span className="font-medium mr-2">Amount:</span>
                    <span className="mr-14">{inst.amount}</span>
                    <span className="font-medium mr-2">Date:</span>
                    <span>{formatDate(inst.installment_date)}</span>
                  </div>

                ))
              ) : (
                <p>No installments available</p>
              )}
            </div>
            <p className="p-2 text-xl">Total Installment Amount: {totalInstallmentAmount.toFixed(2)}</p>
          </div>
        </>
      )}

      {viewOption === "add" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Add Installment</h2>
          <form
            onSubmit={handleInstallmentSubmit}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Installment Amount
              </label>
              <input
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Installment Date
              </label>
              <input
                type="date"
                value={installmentDate}
                onChange={(e) => setInstallmentDate(e.target.value)}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded w-full"
            >
              Add Installment
            </button>
          </form>
        </div>
      )}
    </>
  );
}