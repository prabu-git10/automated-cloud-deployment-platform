# Automated Cloud Deployment & DevOps Platform

A cloud-based automated deployment platform that implements a secure CI/CD pipeline for containerized applications using **GitHub Actions, Docker, Trivy, Amazon ECR, AWS Systems Manager, Amazon EC2, Nginx, and GitHub OIDC**.

The platform automates the application delivery process from source-code commit to deployment on an AWS EC2 instance, while incorporating security scanning, immutable container images, health checks, monitoring, and rollback capabilities.

---

## 🚀 Project Overview

The **Automated Cloud Deployment & DevOps Platform** demonstrates a production-oriented deployment workflow where application changes pushed to GitHub automatically pass through a CI/CD pipeline and are deployed to an AWS EC2 environment.

The platform provides:

* Automated Docker image builds
* Container vulnerability scanning using Trivy
* Secure AWS authentication using GitHub OIDC
* Immutable container image storage using Amazon ECR
* Automated EC2 deployment using AWS Systems Manager
* Docker container management
* Nginx reverse proxy configuration
* Application health verification
* Cloud monitoring and observability
* Failure testing and rollback using previous immutable images

---

## 🎯 Objectives

The primary objectives of this project are to:

* Automate application deployment using CI/CD
* Implement secure authentication between GitHub and AWS
* Containerize the application using Docker
* Integrate security scanning into the deployment pipeline
* Store container images securely in Amazon ECR
* Automate EC2 deployments using AWS Systems Manager
* Implement application health checks
* Configure Nginx as a reverse proxy
* Demonstrate failure recovery and rollback
* Apply practical Cloud and DevOps engineering principles

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Developer      │
                    │       git push      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  GitHub Repository  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   GitHub Actions    │
                    │                     │
                    │  • Checkout         │
                    │  • OIDC Auth        │
                    │  • Docker Build     │
                    │  • Trivy Scan       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Amazon ECR      │
                    │                     │
                    │  cloudops-app       │
                    │  Immutable Images   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ AWS Systems Manager │
                    │        SSM          │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │             EC2                 │
              │                                 │
              │       Ubuntu Linux              │
              │                                 │
              │  ┌───────────────────────────┐  │
              │  │          Nginx            │  │
              │  │         Port 80           │  │
              │  └─────────────┬─────────────┘  │
              │                │                │
              │                ▼                │
              │  ┌───────────────────────────┐  │
              │  │          Docker           │  │
              │  │                           │  │
              │  │       cloudops-app        │  │
              │  │        Port 5000          │  │
              │  └─────────────┬─────────────┘  │
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   CloudOps API      │
                    │   Node.js/Express   │
                    └─────────────────────┘
```

---

## 🔄 CI/CD Pipeline

The deployment pipeline follows this sequence:

```text
Git Push
   ↓
GitHub Actions
   ↓
AWS OIDC Authentication
   ↓
Docker Image Build
   ↓
Trivy Security Scan
   ↓
Amazon ECR Push
   ↓
AWS Systems Manager
   ↓
EC2 Deployment
   ↓
Docker Container
   ↓
Nginx Reverse Proxy
   ↓
Application Health Check
```

### Pipeline Stages

| Stage          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| Source         | Application source code is maintained in GitHub             |
| CI Trigger     | GitHub Actions starts automatically on push to `main`       |
| Authentication | GitHub OIDC securely authenticates with AWS                 |
| Build          | Docker image is created from the Node.js application        |
| Security       | Trivy scans the image for HIGH and CRITICAL vulnerabilities |
| Registry       | Image is pushed to Amazon ECR                               |
| Deployment     | AWS Systems Manager sends deployment commands to EC2        |
| Runtime        | Docker runs the new application container                   |
| Reverse Proxy  | Nginx forwards HTTP requests to the application             |
| Validation     | `/health` endpoint verifies application availability        |

---

## ☁️ AWS Services Used

### Amazon EC2

Hosts the Dockerized CloudOps application in an Ubuntu Linux environment.

### Amazon ECR

Stores Docker images using **immutable image tags**, preventing accidental image overwrites.

### AWS Systems Manager

Provides automated remote command execution on the EC2 instance without requiring SSH-based deployment automation.

### AWS IAM

Controls permissions for GitHub Actions and EC2 using dedicated IAM roles.

### AWS CloudWatch

Provides monitoring and operational visibility for the deployment environment and application logs.

---

## 🔐 Security Implementation

Security was incorporated throughout the deployment pipeline.

### GitHub OIDC

GitHub Actions authenticates to AWS using OpenID Connect instead of storing long-lived AWS access keys in GitHub.

```text
GitHub Actions
      ↓
GitHub OIDC
      ↓
AWS STS
      ↓
IAM Role
      ↓
AWS Resources
```

### IAM Roles

Dedicated roles are used for:

* GitHub Actions
* EC2 instance

This follows the principle of controlled permissions instead of embedding credentials in application code.

### Trivy Security Scanning

Docker images are scanned before being pushed to Amazon ECR.

The pipeline checks for:

```text
HIGH
CRITICAL
```

vulnerabilities.

### Immutable ECR Images

The ECR repository uses immutable tags.

Each deployment generates a unique image tag based on the GitHub commit SHA and workflow run number.

Example:

```text
<commit-sha>-<run-number>
```

This prevents an existing image tag from being overwritten.

### Network Security

The EC2 security group exposes:

```text
HTTP  → Port 80
SSH   → Restricted source
```

The application port `5000` is not unnecessarily exposed publicly because Nginx handles external HTTP traffic.

---

## 🐳 Docker

The application is packaged as a Docker container named:

```text
cloudops-app
```

The application listens on:

```text
5000
```

Container deployment follows:

```text
Amazon ECR
     ↓
Docker Pull
     ↓
Docker Container
     ↓
Port 5000
     ↓
Nginx
     ↓
Port 80
```

---

## 🌐 Nginx Reverse Proxy

Nginx is configured as the reverse proxy in front of the Node.js application.

```text
Client
  ↓
HTTP :80
  ↓
Nginx
  ↓
localhost:5000
  ↓
Docker
  ↓
CloudOps API
```

This separates the public HTTP entry point from the application runtime.

---

## 🖥️ Application

The project uses a Node.js and Express backend called:

**CloudOps Dashboard API**

### API Endpoints

#### Root

```http
GET /
```

Returns:

```json
{
  "message": "CloudOps Dashboard API"
}
```

#### Health

```http
GET /health
```

Returns:

```json
{
  "status": "healthy"
}
```

#### Version

```http
GET /version
```

Returns the currently configured application version.

---

## ❤️ Health Check

The deployment validates the application after starting the Docker container.

```bash
curl --fail http://localhost:5000/health
```

The Nginx endpoint is also verified:

```bash
curl http://localhost/health
```

Successful deployment returns:

```text
HTTP Status: 200
```

with:

```json
{
  "status": "healthy"
}
```

---

## 📊 Monitoring & Observability

CloudWatch is used to provide operational visibility into the AWS environment.

Monitoring includes:

* Application logs
* Nginx access logs
* Deployment activity
* Health monitoring
* CloudWatch alarms

This helps identify application and infrastructure issues after deployment.

---

## 🔄 Failure Testing & Rollback

A controlled deployment failure was introduced by modifying the application's health endpoint to return an unhealthy HTTP status.

The failure was detected through health validation.

The deployment was then rolled back to a previously verified immutable ECR image.

### Rollback Process

```text
Unhealthy Deployment
        ↓
Health Check Failure
        ↓
Failure Identified
        ↓
Select Previous Immutable Image
        ↓
Pull Known-Good Image
        ↓
Stop Current Container
        ↓
Remove Failed Container
        ↓
Start Previous Container
        ↓
Health Check
        ↓
HTTP 200
        ↓
Application Recovered
```

The rollback was successfully verified using the previous ECR image:

```text
cloudops-app:02d08bb86968ab907ce25b64dab63968c583f09e-18-1
```

Final validation:

```text
HTTP Status: 200
{"status":"healthy"}
```

This demonstrates practical recovery using immutable container images.

---

## 📁 Project Structure

```text
automated-cloud-deployment-platform/
│
├── .github/
│   └── workflows/
│       └── docker-build.yml
│
├── app/
│   └── backend/
│       ├── Dockerfile
│       ├── package.json
│       └── application source
│
├── .gitignore
│
└── README.md
```

---

## 🛠️ Technology Stack

### Cloud

* Amazon EC2
* Amazon ECR
* AWS Systems Manager
* AWS IAM
* Amazon CloudWatch

### DevOps / CI/CD

* Git
* GitHub
* GitHub Actions
* GitHub OIDC
* Docker
* Trivy

### Application

* Node.js
* Express.js
* REST API

### Infrastructure / Operating System

* Ubuntu Linux
* Nginx
* Bash

---

## ✅ Project Results

The platform successfully demonstrates:

* Automated CI/CD workflow
* Secure GitHub-to-AWS authentication
* Docker image creation
* Container vulnerability scanning
* Immutable image management
* Amazon ECR integration
* Automated EC2 deployment through SSM
* Docker container deployment
* Nginx reverse proxy
* Application health validation
* Cloud monitoring
* Controlled failure testing
* Immutable-image rollback and recovery

---

## 🎓 Key Learning Outcomes

This project provided practical experience in:

* AWS cloud infrastructure
* CI/CD pipeline design
* GitHub Actions
* AWS IAM
* GitHub OIDC
* Docker containerization
* Amazon ECR
* AWS Systems Manager
* EC2 administration
* Linux and Bash
* Nginx reverse proxy configuration
* Container security scanning
* Cloud monitoring
* Deployment troubleshooting
* Failure recovery and rollback strategies

---

## 🔮 Future Enhancements

Potential future improvements include:

* Automated rollback triggered by failed health checks
* Deployment dashboards
* Improved application version tracking
* Enhanced CloudWatch metrics and dashboards
* Blue/green deployment strategies
* Automated deployment notifications

---

## 👨‍💻 Project

**Automated Cloud Deployment & DevOps Platform**

Built as a practical Cloud Computing and DevOps project demonstrating automated, secure, containerized application delivery on AWS.

**Author:** Lakshmana Prabu
**Domain:** Cloud Computing & DevOps
