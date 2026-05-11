import api from './apiClient';

export const userApi = {
    /**
     * Google OAuth 2.0 Login
     */
    loginUser: async () => {
        return api.get('/auth/google/login')
    },

    /**
     * Update User's WhatsApp phone number
     * @param phoneNumber - The WhatsApp number to register/link
     */
    updatePhone: async (phoneNumber: string) => {
        return api.patch('/user/update-phone', { phoneNumber });
    },

    /**
     * Resend otp request
     */
    resendOtp: async () => {
        return api.get('/user/resend')
    },

    /**
     * Verify the OTP sent to WhatsApp
     * @param code - 6 digit OTP
     */
    verifyOtp: async (code: string) => {
        return api.post('/user/verify-otp', { otp: code });
    }
};

export default userApi;
