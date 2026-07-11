import axios from 'axios';

export const apiClient = axios.create({
    baseURL: `${process.env.API_URL}`,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.X_API_KEY,
    },
});
