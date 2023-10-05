# webapp README

## Table of Contents
- [Prerequisites](#prerequisites)
- [Build and Deploy Instructions](#build-and-deploy-instructions)

## Prerequisites
Before you can build and deploy this web application locally, ensure you have the following prerequisites in place:

### Development Environment
- Operating System (e.g., Windows, macOS, Linux)
- Code Editor or Integrated Development Environment (IDE) (e.g., Visual Studio Code, Sublime Text, IntelliJ IDEA)

### Version Control
- Git: Install Git from [https://git-scm.com/](https://git-scm.com/).

### Node.js and npm (Node Package Manager)
- Node.js and npm are required to manage JavaScript dependencies.
- Download and install them from [https://nodejs.org/](https://nodejs.org/).

### Database (if applicable)
- Install and configure the database (MySQL or MariaDb).

### Web Browser
- You will need a modern web browser like Chrome, Firefox, or Safari for testing your web application.

### GitHub Account
- A GitHub account (or equivalent) is required for version control and collaboration.

### Dependencies and Libraries
- Identify and install any specific dependencies and libraries required for the project. You can usually find these in your project's `package.json` file.

### Environment Variables
- Set up the environment variables in the `.env` file.

## Build and Deploy Instructions
Follow these steps to build and deploy the web application locally:

1. Clone the repository to your local machine:
   
         git clone <repo>

2.Navigate to the project directory:

      cd webapp/AssignmentsAPI
  
3.Install project dependencies using npm:

      npm install
  
4.Configure environment variables.

5.Start the application:

      node app.js
  
6.Open your web browser and access the application at http://localhost:PORT, where PORT is the port number specified in your application configuration.

7.You should now be able to interact with the web application locally.
