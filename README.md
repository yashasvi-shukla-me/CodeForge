![CodeForge Preview](assets/CodeForge.png)

## ⚖️ CodeForge – Distributed Coding Platform

CodeForge is a full-stack distributed coding platform that enables users to solve programming problems with secure, containerized, multi-language code execution.

The system is designed with a separated frontend and backend architecture and integrates the Judge0 API for language-agnostic compilation and execution.

🔗 Live Demo: https://codeforge-theta.vercel.app/  
📂 GitHub: https://github.com/yashasvi-shukla-me/CodeForge

---

## Overview

CodeForge simulates the core workflow of an online coding evaluation platform:

- Users authenticate and access problem sets
- Code submissions are securely executed
- Test cases are evaluated asynchronously
- Verdicts are generated and persisted
- Submission history and results are tracked

The focus of this project is backend system design, secure execution, and scalable architecture.

---

## ⚡️ Key Features

- User authentication and profile management (JWT-based)
- Problem creation, storage, and test case validation
- Asynchronous code submission workflow
- Multi-language execution via Judge0 API
- Secure execution handling and verdict mapping
- Submission history and result tracking
- Clean, responsive frontend interface

---

## 🛠️ Architecture

### Frontend

- React
- Tailwind CSS
- Axios for API communication

### Backend

- Node.js
- Express
- MongoDB
- JWT Authentication
- Judge0 API integration

The frontend and backend are fully decoupled and communicate via RESTful APIs.

---

## 🖥️ System Design Highlights

- Separation of concerns between API layer and execution layer
- Secure, language-agnostic execution handling
- Error handling for compilation failures, runtime errors, and invalid submissions
- Structured submission lifecycle management
- Designed with scalability in mind for future queue-based execution

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yashasvi-shukla-me/CodeForge.git
cd CodeForge
```

### Install Dependencies

```bash
npm install
```

### Run the Backend

```bash
npm run dev
```

## Purpose of the Project

CodeForge was built to explore distributed backend architecture, secure code execution workflows, and real-world system design patterns used in coding evaluation platforms.

The project emphasizes clean API design, modular backend structure, and scalable system thinking.

## Author

Yashasvi Shukla (YASHASVI SHUKLA)

M.Tech (Computer Science) Full-Stack & AI-focused Developer

---
