import api from './apiClient';

export interface EmailItem {
    id: string;
    snippet: string;
}

export const gmailApi = {
    /**
     * Sync current user's emails and fetch a preview
     */
    syncEmails: async () => {
        return api.get('/gmail/sync');
    }
};

export default gmailApi;
