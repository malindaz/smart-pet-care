# Smart Pet Care - Frontend

This is the frontend application for the Smart Pet Care system, built with React.

## Features

- User Registration with multi-step verification
- Phone number and email verification using OTP
- User Login with username/email
- Password Reset functionality
- Profile Management
- Profile Picture Upload
- Responsive Design

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-pet-care.git
cd smart-pet-care/Front-End
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will start running at `http://localhost:3000`

## Usage

### Registration
1. Click on "Register" to start the registration process
2. Fill in basic information (username, first name, last name)
3. Verify phone number using OTP
4. Verify email using OTP
5. Complete profile with password and optional profile picture

### Login
1. Use username or email to login
2. Reset password option available if forgotten

### Profile Management
1. View profile information
2. Update profile details
3. Change profile picture
4. Delete account if needed

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
