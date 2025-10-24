# 🏠 Property Listing App

A React-based property management application built as part of the **React Developer Assessment (Task 1)** for **IPAGE UM Services Pvt Ltd**.  
The app allows users to **view, search, filter, add, and inspect property details** with a clean UI and JSON Server backend.

---

## 🚀 Features

- **Property Listing Page**
  - Displays all available properties using cards.
  - Each card includes name, type, location, price, and short description.

- **Search & Filter**
  - Filter properties by **type** (e.g., Apartment, Villa, Plot, etc.).
  - Search by **name** or **location**.

- **Add Property Form**
  - Add a new property with fields for Name, Type, Price, Location, and Description.
  - Submits data to a **JSON Server API (POST request)**.
  - Automatically updates the list on successful addition.

- **View Details Modal**
  - Opens a modal with full property details and maps.
  - Optionally displays a Google Maps location (if coordinates are available).

- **Responsive Design**
  - Works seamlessly on desktop, tablet, and mobile devices.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Ant design |
| Backend | JSON Server (Mock REST API) |
| Deployment | Render |

---

## 🧩 API Endpoints (JSON Server)

- **GET - https://localhost:your_port/api/properties → Fetch all property listings**
- **POST - https://localhost:your_port/api/properties → Add a new property**
**
```bash
# Start JSON Server
 npm start
```

Example db.json

{
  "properties": [
    {
      "id": 1,
      "name": "Sunset Villa",
      "type": "Villa",
      "price": "₹50,00,000",
      "location": "Goa",
      "description": "A peaceful villa near the beach with sea view."
    }
  ]
}


## 🖥️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/drontv-task.git
cd drontv-task
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Run JSON Server

```bash
cd backend

npm start
```

## 4. Run React App

```bash
npm run dev
```

The app will open at http://localhost:5173

## 🌐 Live Demo
🔗 App(Render): https://drontv-task-1.onrender.com/
🔗 GitHub Repository: https://github.com/Kans2/drontv-task

