# React Application - Geo Healthcare Dashboard

## Overview

Welcome to the Geo Healthcare Dashboard, a React application designed to provide a comprehensive interface for users to explore Health Professional Shortage Areas (HPSA), Licensed Healthcare Facilities, and other healthcare resources.

The Geo Healthcare Dashboard is built using a modern stack that includes React, Tailwind CSS for styling, and various React components to create an intuitive user experience. This README provides instructions for setting up, using, and navigating through the app, as well as detailing its functionality.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Health Professional Shortage Search**: Users can search for Health Professional Shortage Areas (HPSA), including Primary Care, Dental Health, and Mental Health.
- **Licensed Healthcare Facilities**: View and search for licensed healthcare facilities in different regions.
- **Admin Dashboard**: An administrative panel for managing users, uploading files, and monitoring data.
- **User Authentication**: Login functionality with role-based access to certain parts of the application.
- **Interactive Tables and Data Visualizations**: View healthcare-related data in tables and perform searches.
- **Responsive Design**: Tailwind CSS ensures that the application is optimized for both desktop and mobile devices.
- **Versioned API**: Application includes an API with versioned endpoints, simplifying integration with additional applications.

## Installation

To get started with the Geo Healthcare Dashboard, follow these steps:

#### Frontend

### Prerequisites

Ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Clone the Repository

```bash
$ gh repo clone CAHCAI/Geo
$ cd Geo/react-front-end-wip/Geo_app
```

### Install Dependencies

Install the required dependencies using npm or yarn:

```bash
$ npm install
```

### Environment Variables

Create a `.env` file in the root of your project to set up necessary environment variables. Example:

```
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### Running the Frontend Application

To run the application in development mode:

```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### Backend

### Prerequisites

Ensure you have the following software installed on your system:

- Python (v3.0 or later)

```bash
$ cd Geo/Geo
```

### Install Dependencies

Install the required dependencies using pip:

```bash
$ pip install -r requirements.txt
```

### Running the Backend

To run the application:

```bash
$ python manage.py runserver
```

## Usage

The Geo Healthcare Dashboard is divided into multiple sections, accessible through the navigation bar. Here are the key sections of the application:

### Home
The homepage provides information about Health Professional Shortage Areas (HPSAs) and Licensed Healthcare Facilities. Users can access different searches and data categories from here.

### Health Professional Shortage Search
Users can perform a search for different types of health professional shortages such as Primary Care, Dental Health, Mental Health, etc. This section uses an input field with a button to trigger the search and displays the results in an interactive table.

### Licensed Healthcare Facilities
View a list of licensed healthcare facilities. This section provides additional information about the services offered and the geographical distribution of facilities.

### Admin Dashboard
The Admin Dashboard is accessible to authenticated users with admin privileges. It provides an overview of statistics, such as total users, active sessions, address update requests, and other administrative tasks. It also includes a file upload feature to manage relevant documents.

### Login
The Login page allows users to log in with a username and password. Once logged in, users can access different parts of the app based on their role.

## Components

### AdminDashboard Component
The Admin Dashboard component (`AdminDashboard.tsx`) provides an overview for administrators to manage site-related activities. It includes cards displaying statistics about total users, active sessions, and other metrics, as well as a file upload section.

### Footer Component
The Footer (`Footer.tsx`) is displayed across all pages, providing links to government resources and social media, as well as contact and privacy information.

### Header Component
The Header (`GeoHeader.tsx`) displays navigation links, the CA Gov logo, and a search bar. It acts as the main navigation for the application.

### Home Component
The Home page (`Home.tsx`) introduces the main features of the application, including information about Health Professional Shortage Areas (HPSA) and Licensed Healthcare Facilities.

### HpsaSearch Component
The HPSA Search page (`HpsaSearch.tsx`) allows users to perform searches related to different healthcare shortage categories. The data is displayed in tables, categorized by healthcare type.

### Login Component
The Login Component (`Login.tsx`) handles user authentication. It includes fields for username and password, along with error handling for incorrect credentials.

### App Component
The App Component (`App.tsx`) serves as the main entry point, managing navigation between different pages based on the user's actions and login status.

## Contributing

Contributions are welcome! If you have suggestions for improving this project, please feel free to fork the repository and create a pull request. You can also open an issue with the tag "enhancement".

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

