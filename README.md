# ChatSphere

This is a fully functional chat application built using the **MERN stack**. It includes features like adding friends, creating groups, and managing group conversations. While **WebRTC** is not yet integrated, it is planned for future updates to enhance real-time communication.

## Features
- **User management**: Add and manage friends, groups, and group conversations.
- **Real-time messaging**: Powered by **Socket.io** (WebSockets) for real-time updates.
- **Conversation management**: Delete conversations, manage group chats, and more.
- **Responsive design**: The UI is built with **Tailwind CSS** and enhanced with animations from **GSAP** and **Framer Motion**.
- **Icons**: UI icons are sourced from **MUI Icons** for clean and modern visuals.

## Planned Updates
- Integration of **WebRTC** for future real-time voice and video communication.

## Tech Stack
- **Frontend**: React (Tailwind CSS, Framer Motion, GSAP for animations)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time connection**: Socket.io (WebSockets)
- **Icons**: MUI Icons

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Mantissagithub/cat-hackathon-website
   cd cat-hackathon-website
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd chat_app_frontend && npm install
   cd server && npm install
   ```

3. Create a `.env` file in the server directory with your **Google Client ID**, **Google Secret Key**, and **GitHub Client ID**:
   ```bash
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_SECRET=<your-google-secret>
   GITHUB_CLIENT_ID=<your-github-client-id>
   GITHUB_SECRET=<your-github-secret>
   ```

4. Start the application:
   ```bash
   npm run dev
   ```
   in server
   ```bash
   node server.js
   ```

## Contributing
There are some OAuth provider errors that need to be addressed. Please feel free to contribute or submit a PR to resolve these issues!

---

Check out the repository: [ChatSphere GitHub Repo](https://github.com/Mantissagithub/cat-hackathon-website)
