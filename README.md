Real Estate Listing Platform

A full-stack real estate management system featuring:

Public property listings

Admin panel for creating, updating, and deleting properties

Image uploads using Cloudinary

PostgreSQL database integration

REST API built with Node.js and Express

Fully responsive frontend built with Next.js and React

This project demonstrates complete end-to-end development using modern tools and best practices.

Tech Stack
Frontend

Next.js (App Router)

React.js

Tailwind CSS

Cloudinary image upload

Axios / Fetch API

Backend

Node.js

Express.js

PostgreSQL (pg library)

Cloudinary Signed Uploads

CORS

dotenv

Database

PostgreSQL (Local or Cloud: Render, Neon, Supabase)

Features
Public Website

Property listing page

Search and filter (location, price range, project name)

Property detail page with:

Main image

Gallery images

Description

Builder info

Price and location

Admin Panel

Add new properties

Edit existing properties

Delete properties

Upload images through Cloudinary

Manage gallery images

Backend API

POST /properties – Create property

GET /properties – Get all properties

GET /properties/:id – Get single property

PUT /properties/:id – Update property

DELETE /properties/:id – Delete property

GET /uploads/signature – Generate Cloudinary signed upload signature
