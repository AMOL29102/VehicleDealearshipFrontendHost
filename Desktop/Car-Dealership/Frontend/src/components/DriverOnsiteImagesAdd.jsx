import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';

export default function DriverOnsiteImagesAdd() {
    const navigate = useNavigate();
    const [submittedID, setSubmittedID] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);


    let id;
    const handleGoBack = () => {
        navigate('/driverdashboard');
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        id = inputValue;
        setSubmittedID(id);
        setInputValue("");


        try {
            // Upload images first
            await handleUpload();

            toast.success("Car images added successfully!");
            navigate('/driverdashboard');
        } catch (error) {
            
                // Display error message in toast
                console.log("Error in adding car Images. Please try again!")
                toast.error("Error in adding car Images. Please try again!");
            
        }

        console.log(id);
    }


    const handleUpload = async () => {
        setUploading(true);

        try {

            console.log("Subitted id : "+id);
            

            // Handle other image uploads if necessary (similar to DisplayImage)
            for (let i = 0; i < images.length; i++) {
                const uniqueID = Date.now(); 
                const image = images[i];
                const imageFileName = `${id}/OnsiteVehicleImages/${uniqueID}`;
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



    return (

        <>
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
                            maxLength="10"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className='mt-6'>
                        <h2 className="text-xl font-bold mb-2">Upload Images</h2>
                        <input
                            required
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
        </>
    );
}