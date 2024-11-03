import axios from 'axios';

const API_URL = "http://localhost:8000";


export const submitAdminForm = async(formData)=>{
    return await axios.post(`${API_URL}/details`, formData);
}