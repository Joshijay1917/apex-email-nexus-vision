# Apex Email Nexus Vision

This is the **React Native (Expo)** client application for Email Nexus—a next-generation AI inbox management assistant. It integrates real-time Gmail synchronization previews and pairs with your personal WhatsApp account to provide conversational summaries and urgent email alerts.

## 🚀 User Onboarding Flow

The user onboarding experience is broken down into a sequential step-by-step flow designed for high security and clean UX:

### 1. Google Authentication
- The application opens a Secure Web Browser session hitting the backend's `GET /auth/google/login`.
- Upon successful Gmail verification, the backend deeply redirects the device back into the application at `/onboarding-success?token=<JWT>`.

### 2. Secure Token Handlers & Hydration
To ensure future RESTful requests persist identity safely:
- **Auto-Extraction**: Expo Router captures incoming parameters from the URL.
- **Global Client Inoculation**: The token is automatically passed into the application's core network utility (`apiClient.ts`).
- **Implicit Authorization**: The specialized singleton interceptor caches the token and injects `Authorization: Bearer <token>` into the HTTP headers of all sequential API hits automatically.

### 3. WhatsApp Identity Bridge (OTP verification)
To bridge notifications over to WhatsApp, the system initiates a secure verification handshake:
1. **Validation**: The user inputs their region-specific phone number. The app validates format strictly via `libphonenumber-js`.
2. **Dispatch**: User calls `updatePhone`. Backend generates an ephemeral cryptographic OTP payload and broadcasts it to the User's actual WhatsApp chat via the WAHA Bridge.
3. **Verification**: The client enters the received 6-digit sequence into an interactive masked input form. 
4. **Activation**: Upon successful matching, the ephemeral cache flushes, and the Nexus Agent broadcasts the official "Welcome" chat message to start active bridge operation.

---

## 🛠 Installation & Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure you specify your dedicated target backend location within your root `.env`:
```env
EXPO_PUBLIC_BACKEND_URI=http://your-host-ip:3000
```

### 3. Launch the application
```bash
npx expo start
```

## 📚 Architecture Summary

- **`/api`**: Houses strongly-typed, reusable functional connectors like `apiClient.ts`, `userApi.ts`, and `gmailApi.ts`.
- **`/app`**: Expo Router file-system routes defining specific screen hierarchies.
- **`react-native-otp-entry`**: Highly performant customized user input fields for rapid-fire OTP submission.
