<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
# Project README

## Overview

This project is a secure web application built using **Create React App (CRA)** with TypeScript. It serves a production-ready version of the application over HTTPS, ensuring secure communication between the client and server. The application includes features for user registration and login, with input validation and security measures in place to protect sensitive data.

## Tech Stack

- **Frontend**:

  - React.js (with TypeScript)
  - Create React App (CRA)

- **Backend**:
  - Node.js
  - Express.js
  - Helmet (for security headers)
  - CORS (Cross-Origin Resource Sharing)
  - Express Rate Limit (to limit repeated requests)
  - Express Validator (for input validation)
- **SSL/TLS**:
  - Self-signed SSL certificate for secure HTTPS connections

## Project Structure

```
/your-project
│
├── /build                   # Production build of the CRA app
├── /ssl                     # Directory for SSL certificates
│   ├── privatekey.pem       # Private key file
│   └── certificate.pem      # SSL certificate file
├── /src                     # Source code for the CRA app
│   ├── /components          # React components
│   ├── /pages               # Page components
│   └── index.tsx            # Main entry point for the app
├── .env                     # Environment variables configuration
├── .env.template            # Template for the .env file
├── package.json             # Project dependencies and scripts
└── server.js                # HTTPS server setup and configuration
```

## Environment Variables

Before running the application, you need to create a `.env` file based on the provided `.env.template`. This file should contain the following environment variables:

```plaintext
PORT=3000
JWT_SECRET=your_jwt_secret_here
SSL_KEY_PATH=./ssl/privatekey.pem
SSL_CERT_PATH=./ssl/certificate.pem
```

### Example `.env` File

```plaintext
PORT=3000
JWT_SECRET=mysecretkey123!
SSL_KEY_PATH=./ssl/privatekey.pem
SSL_CERT_PATH=./ssl/certificate.pem
```

## How to Run the Application

### Automatic

A script has been created in the package.json file - it will build the static React site, and serve the api and site over an https server.

```bash
npm run build:full
```

### Manual

#### Step 1: Build the React Application

First, ensure you have built your React application. Navigate to your project directory and run:

```bash
npm run build
```

This command creates an optimized production build of your CRA app in the `build` directory.

#### Step 2: Start the HTTPS Server

After building your application, you can start the HTTPS server. Run the following command:

```bash
npm run server
```

This command will start an HTTPS server that serves your built React application on `https://localhost:3001`.

### Accessing Your Application

1. Open your web browser.
2. Navigate to `https://localhost:3001`.

### Bypass Security Warnings

Since you are using a self-signed SSL certificate, your browser may display a warning indicating that the connection is not secure. To proceed:

- **For Chrome**: Click on "Advanced" and then "Proceed to localhost (unsafe)".
- **For Firefox**: Click on "Advanced" and then "Accept the Risk and Continue".

## Conclusion

This README provides an overview of how to set up and run your secure web application built with Create React App and served over HTTPS. Ensure that all environment variables are correctly configured before starting the server. With these steps, you can successfully run your application in a secure environment.

Citations:
[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/29047524/3ebaabed-91a3-47e3-8011-62903f0ee0c6/APDS7311-Assignment-POE.pdf
>>>>>>> f68a695038e122d17ba9f7e5c8a7359af0915242
