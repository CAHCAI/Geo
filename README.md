# React Application - Geo Healthcare Dashboard - Frontend

## Overview

Welcome to the Geo Healthcare Dashboard, a React application designed to provide a comprehensive interface for users to explore Health Professional Shortage Areas (HPSA), Licensed Healthcare Facilities, and other healthcare resources.

The Geo Healthcare Dashboard is built using a modern stack that includes React, Tailwind CSS for styling, and various React components to create an intuitive user experience. This README provides instructions for setting up, using, and navigating through the app, as well as detailing its functionality.

## Tech Stack

<div align="left">
	<img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/>
	<img width="50" src="https://github-production-user-asset-6210df.s3.amazonaws.com/62091613/261395532-b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35.png" alt="Vite" title="Vite"/>
	<img width="50" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/>
</div>

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

# React Application - Geo Django - Backend

## Overview

The Geo Django Backend serves our React Frontent, in addition to providing a versioned API for additional HCAI applications. The backend provides the frontend data on (HPSA), Licensed Healthcare Facilities, and additional information.

The Geo Django Backend is built using a developer-friendly stack that includes the Django Python web framework, PostgreSQL with PostGIS, API connections, to create a developer friendly API. This README provides instructions for setting up, and using the Django backend.

## Tech Stack

<div align="left">
	<img width="50" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png" alt="Python" title="Python"/>
	<img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/62091613/9bf5650b-e534-4eae-8a26-8379d076f3b4" alt="Django" title="Django"/>
	<img width="50" src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" title="PostgreSQL"/>
</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [ERD](#erd)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Versioned API Endpoints**: Users can call versioned endpoints providing stability to their applications during changes.
- **Django Data Models**: Developers have a simplified experience working with the Database.
- **Docker App**: For easily testing and deploying the Backend and Frontend.

## Installation

To get started with the Geo Django Backend, follow these steps:

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

The Geo Django Backend is a standard Django App, with an API, database integration through (`models.py`), and Django admin dashboard.

### Api
The Api allows developers to integrate with the Geo Django Backend service.

### Admin dashboard
The Django Admin dashboard allows management of the Geo Backend service.

## API

Under development (WIP)

## ERD

<img src="https://github.com/CAHCAI/Geo/blob/main/ERD.png">

## WIP Design
## WIP Design
#### WIP Home Page
<img src="https://github.com/CAHCAI/Geo/blob/main/Homepage.png">

#### WIP Data Table
<img src="https://github.com/CAHCAI/Geo/blob/main/Datatable.png">

#### WIP Admin Login
<img src="https://github.com/CAHCAI/Geo/blob/main/Sign_In.png">

#### WIP Admin Page
<img src="https://github.com/CAHCAI/Geo/blob/main/Admin.png">

## Testing

Placeholder for CSC 191

## Deployment

Placeholder for CSC 191

## Developer Instructions

Placeholder for CSC 191

## Contributing

Contributions are welcome! If you have suggestions for improving this project, please feel free to fork the repository and create a pull request. You can also open an issue with the tag "enhancement".

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

