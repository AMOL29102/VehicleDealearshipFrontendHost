import { useState } from 'react';
import { submitAdminForm } from '../api/adminForm.api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';
import axios from 'axios';

function AdminForm() {
  const [vehicleName, setVehicleName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [registernumber, setRegisternumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyTenure, setPolicyTenure] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleBuyPrice, setVehicleBuyPrice] = useState('');
  const [vehicleSellPrice, setVehicleSellPrice] = useState('');
  const [insuranceStartDate, setInsuranceStartDate] = useState("");
  const [insuranceEndDate, setInsuranceEndDate] = useState("");
  const [showInsuranceFields, setShowInsuranceFields] = useState(false);
  const [showOwnerFields, setShowOwnerFields] = useState(false);


  const [vehicleType, setVehicleType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [DisplayImage, setDisplayImage] = useState(null);
  const [fuel, setFuel] = useState('');

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage(file);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };


  const handleUpload = async () => {
    setUploading(true);

    try {
      // Generate the S3 upload URL for the display image
      if (DisplayImage) {
        const displayImageFileName = `${registernumber}/InventoryVehicleImages/0`;
        const displayImageUploadURL = await getUploadURL(DisplayImage, displayImageFileName);
        console.log(displayImageUploadURL);
        await uploadToS3(displayImageUploadURL, DisplayImage);
      }

      // Handle other image uploads if necessary (similar to DisplayImage)
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFileName = `${registernumber}/InventoryVehicleImages/${i + 1}`;
        const imageUploadURL = await getUploadURL(image, imageFileName);
        await uploadToS3(imageUploadURL, image);
      }

      setUploading(false);
      return true;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (vehicleBuyPrice < 0) {
      toast.error("Vehicle price cannot be negative");
      return;
    }

    try {


      // Submit form data after images are uploaded
      await axios.post("https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/details", {
        vehicleName,
        brandName,
        registernumber,
        insuranceCompany,
        insuranceNumber: policyNumber,
        policyNumber,
        insuranceTenure: policyTenure,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        vehicleColor,
        vehicleBuyPrice,
        vehicleSellPrice,
        vehicleType,
        fuel,
        insuranceStartDate,
        insuranceEndDate,
        showInsuranceFields,
        showOwnerFields
      });

      // Upload images first
      await handleUpload();



      toast.success("Vehicle details added successfully!");
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status == 400) {
        // Display error message in toast
        console.log(error.response.data.error)
        toast.error(error.response.data.error);
      }
    }
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
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="vehicleName" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
            <input
              type="text"
              id="vehicleName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="brandName" className="block text-gray-700 text-sm font-bold mb-2">Brand Name</label>
            <input
              type="text"
              id="brandName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="registernumber" className="block text-gray-700 text-sm font-bold mb-2">Register Number</label>
            <input
              type="text"
              id="registernumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={registernumber}
              onChange={(e) => setRegisternumber(e.target.value
                .replace(/^\s+/, "")
                .replace(/[a-z]/g, (char) => char.toUpperCase()))}
            />
          </div>
          <div>
            <label htmlFor="vehicleType" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type</label>
            <select
              id="vehicleType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="truck">Truck</option>
              <option value="tempo">Tempo</option>

            </select>
          </div>

        </div>

        {/* New fields for Vehicle Color and Vehicle Price side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="vehicleColor" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Color</label>
            <input
              type="text"
              id="vehicleColor"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="fuel" className="block text-gray-700 text-sm font-bold mb-2">Fuel Type</label>
            <select
              id="fuel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            >
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
            </select>
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div>
            <label htmlFor="vehicleBuyPrice" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Buying Price</label>
            <input
              type="number"
              id="vehicleBuyPrice"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={vehicleBuyPrice}
              onChange={(e) => setVehicleBuyPrice(Math.max(0, e.target.value))} // Prevent negative input
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="buyPrice" className="block text-gray-700 text-sm font-bold mb-2">Vehilcle Selling Price (To Show)</label>
              <input
                type="number"
                id="vehicleSellPrice"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={vehicleSellPrice}
                onChange={(e) => setVehicleSellPrice(Math.max(0, e.target.value))} // Prevent negative input

              />
            </div>
          </div>
        </div>


        {/* Insurance Details */}
        <div>
          {/* Checkbox to toggle insurance form */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                checked={showInsuranceFields}
                onChange={() => setShowInsuranceFields(!showInsuranceFields)}
                className="mr-2 leading-tight"
              />
              Add Insurance Details
            </label>
          </div>

          {showInsuranceFields && (
            <div>
              {/* Insurance Details */}
              <h2 className="text-xl font-bold mb-2">Insurance Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="insuranceCompany"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Insurance Company
                  </label>
                  <input
                    type="text"
                    id="insuranceCompany"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="policyNumber"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Policy Number
                  </label>
                  <input
                    type="text"
                    id="policyNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="insuranceStartDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Insurance Start Date
                  </label>
                  <input
                    type="date"
                    id="insuranceStartDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={insuranceStartDate}
                    onChange={(e) => setInsuranceStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="insuranceEndDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Insurance End Date
                  </label>
                  <input
                    type="date"
                    id="insuranceEndDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={insuranceEndDate}
                    onChange={(e) => setInsuranceEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="policyTenure"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Policy Tenure
                </label>
                <input
                  type="number"
                  id="policyTenure"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={policyTenure}
                  onChange={(e) => setPolicyTenure(e.target.value)}

                />
              </div>
            </div>
          )}
        </div>

        {/* Owner Details */}
        <div>
          {/* Checkbox to toggle insurance form */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                checked={showOwnerFields}
                onChange={() => setShowOwnerFields(!showOwnerFields)}
                className="mr-2 leading-tight"
              />
              Add Owner Details
            </label>
          </div>
          {showOwnerFields && (<>
            <h2 className="text-xl font-bold mb-2">Owner Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="ownerName" className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
                <input
                  type="text"
                  id="ownerName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ownerPhone" className="block text-gray-700 text-sm font-bold mb-2">Owner Phone</label>
                <input
                  type="text"
                  id="ownerPhone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="ownerEmail" className="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
                <input
                  type="email"
                  id="ownerEmail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ownerAddress" className="block text-gray-700 text-sm font-bold mb-2">Owner Address</label>
                <input
                  type="text"
                  id="ownerAddress"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                />
              </div>
            </div>

          </>)
          }
        </div>

        {/* Image Upload Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Upload Display Image </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleDisplayImageChange}
            className="mb-4"
          />
          {DisplayImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(DisplayImage)}
                alt="Primary Preview"
                className="h-32 mb-6 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>



        <div>
          <h2 className="text-xl font-bold mb-2">Upload Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-4"
          />

          <div className="flex flex-wrap gap-4 mb-5">
            {images.map((image, index) => {
              const imageURL = URL.createObjectURL(image);
              return (
                <img
                  key={index}
                  src={imageURL}
                  alt={`Preview ${index + 1}`}
                  className="h-32 object-cover rounded-lg shadow-lg"
                />
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AdminForm;
