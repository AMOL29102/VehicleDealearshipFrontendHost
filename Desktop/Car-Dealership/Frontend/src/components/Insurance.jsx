import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Insurance() {
    const [installmentAmount, setInstallmentAmount] = useState('');
    const [installmentDate, setInstallmentDate] = useState('');

    const handleInstallmentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/installments/add", {
                amount: installmentAmount,
                date: installmentDate,
            });

            if (response.status === 200) {
                toast.success('Installment added successfully');
                // Reset the form after submission
                setInstallmentAmount('');
                setInstallmentDate('');
            }
        } catch (error) {
            console.error('Error adding installment:', error);
            toast.error('Failed to add installment. Please try again.');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mt-6 mb-4">Add Installment</h2>
            <form onSubmit={handleInstallmentSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Installment Amount</label>
                    <input
                        type="number"
                        value={installmentAmount}
                        onChange={(e) => setInstallmentAmount(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Installment Date</label>
                    <input
                        type="date"
                        value={installmentDate}
                        onChange={(e) => setInstallmentDate(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                    Add Installment
                </button>
            </form>
        </>
    );
}
