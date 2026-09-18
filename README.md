# AzureFlow

A modern static Next.js React application created to demonstrate an automated CI/CD pipeline using Azure DevOps tools.

The project demonstrates the following workflow:

**GitHub → Azure Pipelines → Docker → Azure Container Registry → Azure App Service**

## Project Purpose

AzureFlow is a simple static web application used as a practical DevOps learning project.

The main focus is to demonstrate:

* Automated CI/CD with Azure Pipelines
* Docker containerization
* Azure Container Registry (ACR)
* Automated deployment to Azure App Service
* Pipeline monitoring and troubleshooting
* Basic DevOps concepts using Azure tools

## Run Locally

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Application Version

The application displays its current version for CI/CD deployment testing.

Current version:

```text
v1.0.0
```

During pipeline testing, the version will be changed, for example:

```text
v1.0.0 → v1.0.1
```

After pushing the change to GitHub, Azure Pipelines should automatically build a new Docker image and deploy the updated version to Azure App Service.

## Docker

The application is a static Next.js React website with no backend, database, authentication, or external API dependencies.

The application is containerized using Docker before being pushed to Azure Container Registry.

The deployment flow is:

```text
Next.js Application
        ↓
Docker Image
        ↓
Azure Container Registry
        ↓
Azure App Service
```

## CI/CD Workflow

```text
Developer
    ↓
GitHub
    ↓
Azure Pipelines
    ↓
Build & Test
    ↓
Docker Build
    ↓
Azure Container Registry
    ↓
Azure App Service
    ↓
Live Website
```

## Project Sections

* Hero section with pipeline readiness status
* CI/CD workflow visualization
* Azure and DevOps technology cards
* Production deployment information
* Application version for deployment testing

## Technologies

* Next.js
* React
* TypeScript
* pnpm
* Docker
* Azure Pipelines
* Azure Container Registry
* Azure App Service
* GitHub

## Learning Objectives

This project is designed to provide practical experience with:

* Continuous Integration (CI)
* Continuous Deployment (CD)
* Docker containerization
* Container image registries
* Automated cloud deployment
* Azure DevOps pipelines
* Pipeline monitoring
* Deployment troubleshooting
