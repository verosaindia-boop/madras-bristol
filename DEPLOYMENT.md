# Madras Bristol Website - Vercel Deployment Guide

## Project Structure

```
/workspaces/madras-bristol/
├── public/                 # Static website files (HTML, CSS, JS, images)
├── api/                    # Serverless functions for contact forms
│   └── contact.js         # Handles both contact and booking form submissions
├── vercel.json            # Vercel configuration
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with your email credentials:

```env
EMAIL_USER=info@madrasbristol.com
EMAIL_PASSWORD=Madras@2026
```

Note: For production, use Vercel's Environment Variables dashboard.

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables in the Vercel dashboard
6. Deploy

### 4. Configure Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - `EMAIL_USER`: your email address
   - `EMAIL_PASSWORD`: your email password

## Features

- **Static Content**: All HTML, CSS, JS, and images are served as static files
- **Contact Forms**: Two forms (contact and booking) submit to `/api/contact` endpoint
- **Email Notifications**: Uses Nodemailer with Hostinger SMTP
- **Form Validation**: Client-side validation using Bootstrap Validator
- **Responsive Design**: Mobile-friendly layout

## Form Endpoints

Both forms (`contact-us.html` and `book-table.html`) submit to:
- **Endpoint**: `POST /api/contact`
- **Required Fields**:
  - `name` (text)
  - `email` (email)
  - `phone` (phone number)
  - `message` (optional)
  - `person` (optional, for booking)
  - `date` (optional, for booking)
  - `time` (optional, for booking)

## Troubleshooting

### Forms Not Submitting
1. Check browser console for errors (F12)
2. Verify environment variables are set correctly
3. Check Vercel deployment logs

### Emails Not Sending
1. Verify EMAIL_USER and EMAIL_PASSWORD in environment variables
2. Check if SMTP credentials are correct
3. Ensure port 465 is not blocked

### Deployment Failed
1. Check `vercel.json` configuration
2. Ensure `package.json` has correct dependencies
3. Verify all files are in correct directories

## Local Testing

To test locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Start development server
vercel dev
```

Access your site at `http://localhost:3000`

## Additional Notes

- The original PHP files have been replaced with Node.js serverless functions
- Static files are served from the `public/` directory
- API routes are in the `api/` directory
- Vercel automatically scales based on traffic

