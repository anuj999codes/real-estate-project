# Real Estate Listing Platform

A full-stack real estate management system featuring:

- Public property listings  
- Admin panel for creating, updating, and deleting properties  
- PostgreSQL database integration  
- REST API built with Node.js and Express  
- Fully responsive frontend built with Next.js and React  

This project demonstrates complete end-to-end development using modern tools and best practices.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express.js
- PostgreSQL
- dotenv
- CORS

### Database
- PostgreSQL

---

## Features

### Public Website
- Property listing page  
- Search and filter (location, price range, project name)  
- Property detail page with images and description  

### Admin Panel
- Add new properties  
- Edit properties  
- Delete properties
## Environment Variables

### Backend `.env`
- PORT=4000
- DATABASE_URL=postgresql://property_db_z6to_user:WIt9Upv2rkkWDAySPcNz8Z0JfFsxww9Z@dpg-d4bm7nh5pdvs73d0e8u0-a.singapore-postgres.render.com/property_db_z6to
- CLOUDINARY_CLOUD_NAME=dakazylvn
- CLOUDINARY_API_KEY=235525954588421
- CLOUDINARY_API_SECRET=t_0h4lw65ogCPVO7soogi5yu0Co
- FRONTEND_ORIGIN=http://localhost:3000


### Frontend `.env.local`
- NEXT_PUBLIC_API_BASE=https://real-estate-project-wbj3.onrender.com
---

## Running Locally

### Backend
- `cd backend`
- `npm install`
- `npm run dev`

### Frontend
- `cd frontend`
- `npm install`
- `npm run dev`

---

## API Endpoints
- POST /properties
- GET /properties
- GET /properties/:id
- PUT /properties/:id
- DELETE /properties/:id

  

