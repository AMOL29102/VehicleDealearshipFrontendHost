import React from 'react';

function EnquiryCard({ customerName, customerPhone, description, date, onDelete }) {
  //console.log("date in Enquiry card "+date)
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 transition duration-300 ease-in-out hover:shadow-xl transform hover:scale-105 relative">
      <h3 className="text-teal-700 text-2xl font-semibold mb-2">{customerName}</h3>
      <p className="text-gray-600 text-lg mb-2"><span className="font-medium">Phone:</span> {customerPhone}</p>
      <p className="text-gray-600 text-lg mb-4"><span className="font-medium">Description:</span> {description}</p>
      <p className="text-gray-500 text-sm italic">Registered on: {date}</p>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 focus:outline-none"
      >
        Delete
      </button>
    </div>
  );
}

export default EnquiryCard;
