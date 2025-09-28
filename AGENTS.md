# Agent Documentation

This document provides an overview of the project architecture, setup, and functionality for future AI agents.

## Project Overview

This project is a Customer Relationship Management (CRM) application built with a Next.js frontend and a Supabase backend. It allows users to manage contacts, deals, and tasks. The application is containerized using Docker for easy setup and deployment.

## Architecture

-   **Frontend:** Next.js (React)
-   **Backend:** Supabase (PostgreSQL, GoTrue, PostgREST)
-   **Styling:** Tailwind CSS with shadcn/ui components
-   **Containerization:** Docker and Docker Compose

## Database Schema

The database schema is managed through migration files located in `supabase/migrations`.

### Tables

-   **`contacts`**: Stores contact information.
    -   `id`: SERIAL PRIMARY KEY
    -   `created_at`: TIMESTAMPTZ DEFAULT NOW()
    -   `name`: TEXT
    -   `email`: TEXT
    -   `phone`: TEXT
    -   `company`: TEXT
    -   `role`: TEXT
-   **`deals`**: Tracks sales deals.
    -   `id`: SERIAL PRIMARY KEY
    -   `created_at`: TIMESTAMPTZ DEFAULT NOW()
    -   `contact_id`: INTEGER REFERENCES contacts(id)
    -   `name`: TEXT
    -   `stage`: TEXT
    -   `value`: DECIMAL
-   **`tasks`**: Manages tasks associated with deals or contacts.
    -   `id`: SERIAL PRIMARY KEY
    -   `created_at`: TIMESTAMPTZ DEFAULT NOW()
    -   `deal_id`: INTEGER REFERENCES deals(id)
    -   `contact_id`: INTEGER REFERENCES contacts(id)
    -   `title`: TEXT
    -   `due_date`: DATE
    -   `completed`: BOOLEAN DEFAULT FALSE

## Setup and Running the Application

To run the application, you need Docker and Docker Compose installed.

1.  **Start the services:**
    ```bash
    docker-compose up -d
    ```
2.  **Access the application:**
    -   Next.js App: [http://localhost:3000](http://localhost:3000)
    -   Supabase Studio: [http://localhost:8080](http://localhost:8080)

## Implemented Features

-   **Authentication:** User sign-up and sign-in using Supabase Auth.
-   **Protected Routes:** Application routes are protected, redirecting unauthenticated users to the login page.
-   **Contacts Management:** View, add, edit, and delete contacts.
-   **Deals Management:** View, add, edit, and delete deals.
-   **Tasks Management:** View, add, edit, and delete tasks.
-   **Dashboard:** Displays key metrics from the database, including monthly revenue, new deals, pipeline value, and conversion rate.

## Shortcomings and Future Improvements

-   **User Profiles:** There is no dedicated user profile management.
-   **Permissions:** The application lacks a role-based access control (RBAC) system. All users can see and modify all data.
-   **Data Validation:** There is minimal server-side data validation.
-   **Error Handling:** Error handling can be improved, especially for Supabase API calls.
-   **Testing:** The project lacks a testing suite.
-   **Real-time Updates:** The application could benefit from real-time updates using Supabase subscriptions.
-   **Assignees:** The `assignee` field in the `tasks` table is a simple text field. This should be linked to a `users` table.
-   **Deal `contact_id`:** In the `DealDialog`, the `contact_id` is a simple text field. This should be a dropdown that allows selecting from existing contacts.
-   **Task `contact_id` and `deal_id`:** In the `TaskDialog`, the `contact_id` and `deal_id` are simple text fields. These should be dropdowns that allow selecting from existing contacts and deals.
-   **Avatars:** Avatars are currently placeholders or generated from email addresses. A proper avatar upload and management system could be implemented.
-   **Dashboard Filtering:** The dashboard does not have date range filtering for the stats.
-   **Analytics and Reports:** The analytics and reports tabs on the dashboard are not yet implemented.
