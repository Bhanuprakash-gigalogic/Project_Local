# Chatbot Service with Fuzzy Search

A production-ready rule-based chatbot service integrated with a React Native e-commerce app.

## Features
- **Fuzzy Search Logic**: Uses `string-similarity` to match user queries with FAQs (>0.6 threshold).
- **Socket.io**: Real-time message updates.
- **Backend**: Node.js, Express, MongoDB.
- **Frontend**: React Native (Expo) Chat UI.
- **Escalation**: Auto-escalates to a ticket system if no match found.

## Project Structure
- `/backend`: API Server.
- `/frontend`: Mobile App Chat Component.

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas)

## Setup

### Backend
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` (create file based on `.env.example`).
4.  Run Server:
    ```bash
    npm run dev
    ```
5.  Run Tests:
    ```bash
    npm test
    ```

### Frontend
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run Expo:
    ```bash
    npx expo start
    ```

## API Documentation
Base URL: `/api/v1/chatbot`

- `POST /sessions`: Start session.
- `POST /sessions/:id/messages`: Send message.
- `GET /sessions/:id/messages`: Get history.
- `GET /intents`, `POST /intents` (Admin): Manage intents.

## Managing Bot Intents (Admin)
The system now includes a dynamic Intent Management system.
- **Backend**: Stored in `intents` collection. Seeded with defaults on first run.
- **Frontend**: Accessible via "Admin" button in Chat Screen.
    - **Add/Edit**: Create new intents with multiple training phrases.
    - **Delete**: Remove obsolete intents.
    - **Search**: Filter intents by name or phrase.
- **Matching Logic**: Intents are checked first (Threshold > 0.6) before falling back to FAQs.
