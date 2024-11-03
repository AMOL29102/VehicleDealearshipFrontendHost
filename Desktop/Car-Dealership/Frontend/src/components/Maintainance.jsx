import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';

export function Maintainance({ registernumber, onMaintenanceAdded }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [maintainanceDate, setMaintainanceDate] = useState('');
    const [role, setRole] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setAdding(true);
            const response = await axios.post('https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/maintainance', { registernumber, description, price, role, maintainanceDate });




            const nextIndex = response.data.nextIndex;
            // Handle other image uploads if necessary (similar to DisplayImage)

            const file = files[0];
            const maintainanceDocPath = `${registernumber}/MaintenanceDoc/${nextIndex}`;
            const maintainanceDocUrl = await getUploadURL(file, maintainanceDocPath);
            await uploadToS3(maintainanceDocUrl, file);


            // Call the parent callback to refresh maintenance records
            if (onMaintenanceAdded) { onMaintenanceAdded(); }

            // Clear form fields
            setTitle('');
            setPrice('');
            setDescription('');
            setFiles([]);
            setMaintainanceDate('');
            setRole('');

            toast.success('Maintenance record added successfully!');
            console.log(response.data);

        } catch (error) {
            console.error('Error adding maintenance record:', error);
            toast.error('Failed to add maintenance record.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Add Maintenance Record</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Maintenance Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full text-sm md:text-base"
                    >
                        <option value="" disabled>Select role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Maintenance Date</label>
                    <input
                        type="date"
                        value={maintainanceDate}
                        onChange={(e) => setMaintainanceDate(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Documents</label>
                    <input
                        type="file"
                        onChange={(e) => setFiles([...e.target.files])}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={adding}
                >
                    {adding ? 'Adding...' : 'Add Maintenance Record'}
                </button>
            </form>
        </>
    );
}
