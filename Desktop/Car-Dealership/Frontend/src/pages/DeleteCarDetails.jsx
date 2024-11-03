import React, { useState } from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import Modal from 'react-modal'; // Import the react-modal package
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Set up the root element for the modal
Modal.setAppElement('#root');

function DeleteCarDetails() {
  const [registernumber, setRegisternumber] = useState(''); // Holds the current input
  const [submittedID, setSubmittedID] = useState(''); // Holds the submitted ID for deletion
  const [submitted, setSubmitted] = useState(false); // To control if the form was submitted
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const navigate = useNavigate();
  // Fetch car details using the submitted ID
  const fetchCarDetails = async (currDeleteId) => {
    setLoading(true); // Set loading to true before the fetch call
    setError(null); // Reset error before fetch
    try {
      const response = await axios.get(`https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/car/${currDeleteId}`);
      setCarData(response.data); // Store the fetched car data
      console.log(response.data); // Log the fetched car data
    } catch (err) {
      setCarData(null);
      console.error('Error fetching car details:', err);
      setError('Error fetching car details'); // Set error message if fetch fails
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const currDeleteId = registernumber;

    setSubmittedID(registernumber); // Store the registernumber for deletion
    setRegisternumber(''); // Clear the input field after submission
    setSubmitted(true); // Set the form as submitted



    await fetchCarDetails(currDeleteId); // Call the fetch function

  };

  // Simulate deletion from DB and handle success/error with toast notifications
  const deleteEntry = async () => {

    // API call goes here: axios.delete(`/api/vehicles/${submittedID}`)
    try {
      console.log(`Deleting entry for Vehicle with ID: ${submittedID}`);
      const response = await axios.delete(`https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/delete`, {
        params: {
          deletedID: submittedID
        }
      });


      console.log("Delete entry : " + response.data); // Log the fetched car data


      toast.success(`Vehicle with Reg ID ${submittedID} deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setModalOpen(false); // Close the modal after successful deletion
      setSubmitted(false); // Reset the submission state

    } catch (error) {
      toast.error(`Error occurred while deleting vehicle: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setModalOpen(false); // Close the modal even if an error occurs
    }
  };

  // Open modal for final confirmation
  const handleDeleteConfirmation = () => {
    setModalOpen(true); // Show modal after clicking the "Confirm" button
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false); // Close the modal without deletion
  };
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  return (
    <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">
      <div className="mb-4">
        <button
          onClick={handleGoBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
        >
          Back to Dashboard
        </button>
      </div>
      {/* Form for submitting the vehicle reg ID */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
        <div>
          <label
            htmlFor="brandName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Vehicle Reg ID
          </label>
          <input
            type="text"
            id="brandName"
            required
            maxLength="10" // Restrict input to 10 characters
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={registernumber}
            onChange={(e) => setRegisternumber(e.target.value
              .replace(/^\s+/, "")
              .replace(/[a-z]/g, (char) => char.toUpperCase()))}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
        >
          Submit
        </button>
      </form>

      {/* Loading State */}
      {/* {loading && submitted && <p className="text-center mt-4">Loading...</p>} */}

      {/* Error Message */}
      {error && !loading && (
        <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded text-center text-red-700">
          {error}
        </div>
      )}

      {/* No data found message */}
      {!carData && submitted && !loading && !error && (
        <p className="text-center mt-4">No data found for this ID.</p>
      )}

      {submitted && carData && carData.car && carData.car.status === true && (
        <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded text-center text-green-700">
          Already Sold
        </div>
      )}

      {/* Display confirmation section only after form is submitted */}
      {submitted && carData && carData.car && carData.car.status === false && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <div className="container mx-auto">
            <main className="py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-md p-4 ">
                  <h1 className="text-2xl font-bold mb-4 mt-16">{carData.car.carcompany} {carData.car.carname}</h1>


                  <div>
                    <img
                      src={carData.images[0]}  // Correctly use the image URL
                      alt={`Car ${carData.car.carname}`}
                      className="w-full h-auto rounded-t-lg"
                    />
                  </div>


                </div>

                <div className="bg-white shadow-md rounded-md p-4">
                  <h2 className="text-2xl font-bold mb-4">{carData.car.carname} Details</h2>
                  <h3 className="text-lg font-semibold mb-2">Car Information</h3>
                  <ul>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Car Name:</span>
                      <span>{carData.car.carname}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Make:</span>
                      <span>{carData.car.carmake}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Company:</span>
                      <span>{carData.car.carcompany}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Color:</span>
                      <span>{carData.car.carcolor}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Price:</span>
                      <span>{carData.car.carprice}</span>
                    </li>
                  </ul>

                  {/* Insurance Section */}
                  {/* <h3 className="text-lg font-semibold mb-2 mt-4">Insurance Information</h3>
                  <ul>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Insurance Company:</span>
                      <span>{carData.insurance.companyname}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Policy Number:</span>
                      <span>{carData.insurance.policynum}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Policy Tenure:</span>
                      <span>{carData.insurance.policytenure} years</span>
                    </li>
                  </ul> */}

                  {/* Owner Section */}
                  {/* <h3 className="text-lg font-semibold mb-2 mt-4">Owner Information</h3>
                  <ul>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Owner Name:</span>
                      <span>{carData.owner.ownername}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Phone Number:</span>
                      <span>{carData.owner.ownerphone}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Email:</span>
                      <span>{carData.owner.owneremail}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Address:</span>
                      <span>{carData.owner.owneraddress}</span>
                    </li>
                  </ul> */}
                </div>
              </div>
            </main>
          </div>
          {/* First-stage confirm button */}
          <button
            onClick={handleDeleteConfirmation}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Modal for final confirmation */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Deletion"
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p>Are you sure you want to delete the vehicle with reg No.: {submittedID}?</p>
        <div className="mt-6">
          <button
            onClick={() => deleteEntry()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Confirm Delete
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Toast Container to render toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default DeleteCarDetails;
