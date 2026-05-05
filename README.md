# Leadership Assessment App

## Overview

This project was built as part of a technical assessment for Planet Ganges Consulting.

It is a small full-stack web application where users complete a 9-question leadership self-assessment. Based on their responses, the app calculates scores across three dimensions and provides personalised feedback. After submission, the user receives a report via email.

---

## Features

* 9-question assessment (1–5 scale)
* Three dimensions:

  * Decision Making
  * Communication
  * Strategic Thinking
* Client-side scoring and banding (Low / Medium / High)
* Personalised feedback based on results
* Backend API to receive assessment data
* Email report sent to the user
* Basic error handling and loading states

---

## Tech Stack

**Frontend**

* React (Vite)
* JavaScript

**Backend**

* Django

**Email**

* Gmail SMTP (App Password)

---

## Email Delivery

Email functionality is implemented using Resend.

Note: In development (sandbox mode), Resend restricts sending emails to unverified recipients. This is why emails may only be received on the registered account.

In a production environment, I would verify a custom domain to enable sending emails to all users.

## How It Works

1. User fills out the form and submits responses.
2. Frontend calculates:

   * Scores per dimension
   * Bands (Low / Medium / High)
   * Feedback for each dimension
3. Data is sent to the backend as JSON.
4. Backend sends an HTML email report to the user.
5. User sees their results on screen.

---

## Scoring Logic

Each dimension has 3 questions:

* Minimum score: 3
* Maximum score: 15

Bands are defined as:

* 3–7 → Low
* 8–11 → Medium
* 12–15 → High

Feedback is generated based on the band for each dimension.

---

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Email credentials are required for sending reports.

Example:

```env
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

Note: Use a Gmail App Password (not your normal password).

---

## What I’d Improve With More Time

* Improve UI using Tailwind for a more polished design
* Add charts/visualizations for better result presentation
* Store assessment data in a database
* Add retry handling if email sending fails
* Generate richer feedback using AI

---

## AI Usage

AI was used for guidance in structuring parts of the code and debugging issues.
I made sure to understand and modify everything before using it.

---

## Notes

This project focuses on functionality, clarity, and structure. The goal was to build a working and extendable system similar to real-world assessment tools.

---

**Built by: Sumit Kumar**
