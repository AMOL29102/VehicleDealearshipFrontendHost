import axios from 'axios';
require('dotenv').config();

export const fetchAllDetails = async () => {
    return await axios.get(`${process.env.URL}/`);
};


export const fetchSingleVehicleDetails = async () => {
    return await axios.get(`${process.env.URL}/car`);
};