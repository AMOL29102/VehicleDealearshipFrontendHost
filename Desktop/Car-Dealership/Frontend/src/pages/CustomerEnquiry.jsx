import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import EnquiryCard from '../components/EnquiryCard';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

function CustomerEnquiry() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [countQueries, setCountQueries] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const openDeleteModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEnquiry(null);
  };

  const handleDelete = async () => {
    if (!selectedEnquiry) return;

    try {
      const { serialnum, customerPhone } = selectedEnquiry;

      await axios.delete('https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/customer', {
        data: {
          serialnum: serialnum,
          custcontact: customerPhone
        }
      });

      // Update the state to remove the deleted enquiry
      setEnquiries(enquiries.filter((enquiry) =>
        enquiry.serialnum !== serialnum || enquiry.customerPhone !== customerPhone
      ));
      toast.success('Enquiry deleted successfully!');

      // Re-fetch enquiries after deletion
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to delete enquiry');
    } finally {
      closeModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setUploading(true);
      const submissionDate = (new Date).toLocaleString();
      await axios.post('https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/customer', {
        custName: customerName,
        custContact: customerPhone,
        custQuery: description,
        date: submissionDate
      });

      setEnquiries([...enquiries, { custname: customerName, custcontact: customerPhone, custquery: description, date: submissionDate }]);

      // Re-fetch enquiries after submission
      fetchEnquiries();

      toast.success('Enquiry submitted successfully!');

      // Reset form fields
      setCustomerName('');
      setCustomerPhone('');
      setDescription('');
    } catch (error) {
      toast.error('An error occurred while saving details');
    } finally {
      setUploading(false);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/customer');
      const formattedEnquiries = response.data.enquiries.map(enquiry => ({
        serialnum: enquiry.serialnum,
        customerName: enquiry.custname,
        customerPhone: enquiry.custcontact,
        description: enquiry.custquery,
        date: enquiry.enquirydate
      }));
      setEnquiries(formattedEnquiries);
      setCountQueries(response.data.totalCount);
    } catch (error) {
      toast.error('Failed to fetch enquiries');
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-white">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <div className="mb-4">
        <button
          onClick={handleGoBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="p-8 shadow-lg rounded-lg bg-gray-100">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-teal-700">Customer Enquiry Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="customerName" className="block text-gray-700 text-sm font-semibold mb-2">Customer Name</label>
              <input
                type="text"
                id="customerName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-300"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-gray-700 text-sm font-semibold mb-2">Phone No.</label>
              <input
                type="text"
                id="customerPhone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-300"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description of Enquiry</label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-300 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="my-12 border-t-2 border-teal-300"></div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Customer Enquiries ({countQueries})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(enquiries) && enquiries.map((enquiry, index) => (
            <EnquiryCard
              key={index}
              customerName={enquiry.customerName}
              customerPhone={enquiry.customerPhone}
              description={enquiry.description}
              date={enquiry.date}
              onDelete={() => openDeleteModal(enquiry)}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Deletion"
        className="bg-white w-full sm:w-2/3 lg:w-1/3 mx-4 sm:mx-auto mt-32 p-4 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-sm sm:text-base mb-4">Are you sure you want to delete this enquiry?</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded mr-2 text-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CustomerEnquiry;
