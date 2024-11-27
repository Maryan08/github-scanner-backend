# GitHub Scanner Backend

A backend application built with Apollo GraphQL to scan and retrieve details about GitHub repositories. This project supports fetching a list of repositories and viewing detailed information about a specific repository.

---

## Features

- **List Repositories**: Displays repository name, size, and owner.
- **Repository Details**: Includes name, size, owner, privacy status, number of files, active webhooks, and YAML file content.
- **Concurrency Handling**: Scans up to two repositories in parallel.
- **Error Handling & Validation**: Comprehensive validation and error handling for API responses.

---

## Prerequisites

Ensure you have the following installed:
- Node.js (v20 or later)
- npm
- A valid GitHub Developer Token (with `repo` access scope)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/github-scanner.git
   cd github-scanner

2. Install dependencies
    ```bash
   npm install
   
3. Start the Application
     ```bash
   npm run start
