# Github Explorer

You can access the app [here](https://gh-tracker.stark.pomerain.org/)

This repository is a minimal boilerplate for building modern web applications using:

## Tech Stack

- **React** (UI library)
- **Tailwind CSS** (styling)
- **Shadcn UI** (components)
- **React Router** (routing)
- **TypeScript** (static typing)
- **Vite** (blazing fast build tool and dev server)
- **ESLint** (code linting)
- **Docker** (containerization)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized usage)

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:fathurifki/github-user-tracker.git
   cd github-user-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App Locally

Start the development server with hot module replacement:

```bash
npm run dev
# or
yarn dev
```

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

### Running the App in Docker

Build and start the Docker container:

```bash
docker build -t github-repo-search .
docker run -p 3000:3000 github-repo-search
```

### Accessing the App

Open your browser and navigate to:

```bash
http://localhost:3000
```
