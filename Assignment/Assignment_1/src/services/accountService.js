import axiosClient from '../api/axiosConfig';

const accountService = {
    login: async (credentials) => {
        const response = await axiosClient.post('/accounts/login', credentials);
        return response.data;
    },

    getAllAccounts: async () => {
        const response = await axiosClient.get('/accounts');
        return response.data;
    },

    getAccountById: async (id) => {
        const response = await axiosClient.get(`/accounts/${id}`);
        return response.data;
    },

    createAccount: async (accountData) => {
        const response = await axiosClient.post('/accounts', accountData);
        return response.data;
    },

    updateAccount: async (id, accountData) => {
        const response = await axiosClient.put(`/accounts/${id}`, accountData);
        return response.data;
    },

    deleteAccount: async (id) => {
        const response = await axiosClient.delete(`/accounts/${id}`);
        return response.data;
    }
};

export default accountService;
