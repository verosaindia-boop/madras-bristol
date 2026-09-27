# Madras Bristol Website Report

## Overview
This is the official website for **Madras Bristol**, an Indian restaurant located at 114 Rodway Rd, Patchway, Bristol BS34 5PG. The website showcases the restaurant's offerings, facilitates table reservations and general inquiries, and provides information about the establishment.

## Technical Stack
- **Platform**: Vercel (Serverless deployment)
- **Frontend**: Static HTML/CSS/JavaScript
- **Backend**: Node.js serverless functions (Vercel)
- **Email Service**: Nodemailer with Hostinger SMTP
- **Build Tool**: Vercel CLI

## Project Structure
```
/madras-bristol/
├── public/                 # Static website files
│   ├── *.html              # Website pages (index, about-us, our-menus, etc.)
│   ├── css/                # Stylesheets (bootstrap, style, responsive, etc.)
│   ├── js/                 # JavaScript files
│   ├── images/             # Image assets
│   └── fonts/              # Font files
├── api/                    # Serverless API endpoints
│   └── contact.js          # Handles form submissions (contact & booking)
├── vercel.json             # Vercel configuration
├── package.json            # Node.js dependencies
├── README.md               # Basic project info
└── DEPLOYMENT.md           # Detailed deployment guide
```

## Key Features

### 1. Static Content Delivery
All HTML, CSS, JavaScript, and image files are served as static assets from the `public/` directory, ensuring fast load times and reliable performance.

### 2. Contact & Booking Forms
- **Two forms**: Contact Us (`contact-us.html`) and Table Booking (`book-table.html`)
- **Single API endpoint**: Both forms submit to `POST /api/contact`
- **Form validation**: Client-side validation using Bootstrap Validator
- **Dynamic email routing**: Different email subjects/bodies based on form type

### 3. Email Notifications
- Uses **Nodemailer** with Hostinger SMTP (`smtp.hostinger.com:465`)
- Sends notifications to `booking@madrasbristol.com`
- Includes form data in HTML-formatted emails
- Supports reply-to functionality for easy responses

### 4. Responsive Design
- Mobile-friendly layout using Bootstrap framework
- Responsive breakpoints for various device sizes
- Touch-friendly navigation and controls

### 5. Interactive Elements
- Image sliders/swiper components (Swiper.js)
- Carousel galleries (Owl Carousel)
- Lightbox functionality (FancyBox)
- Animated elements (WOW.js, Animate.css)
- Video background support

## Pages Overview

### Core Pages
- **index.html** - Homepage with hero slider, special offers, and introduction
- **about-us.html** - Restaurant story, history, and chef information
- **our-menus.html** - Complete menu with categories and pricing
- **gallery.html** - Photo gallery of dishes, restaurant ambiance, and events
- **contact-us.html** - General inquiry form with location and contact info
- **book-table.html** - Table reservation form (date, time, party size)
- **bucket-biryani.html** - Special promotion page for bucket biryani offers
- **careers.html** - Job openings and career opportunities

## API Endpoint: `/api/contact`

### Method
- `POST` only (returns 405 for other methods)

### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (required)",
  "message": "string (optional)",
  "person": "string (optional, for booking)",
  "date": "string (optional, for booking)",
  "time": "string (optional, for booking)"
}
```

### Response Format
- **Success**: `{ "type": "success", "message": "Your message has been sent successfully!" }`
- **Validation Error**: `{ "error": "Missing required fields" }` (400)
- **Method Error**: `{ "error": "Method not allowed" }` (405)
- **Server Error**: `{ "type": "danger", "message": "Failed to send message. Please try again later." }` (500)

### Email Logic
- **Contact Form**: Subject = "New Contact Form Message - Madras Bristol"
- **Booking Form**: Subject = "New Table Reservation / Contact Enquiry"
- Both include formatted HTML with all submitted fields

## Deployment Information

### Local Development
```bash
# Install dependencies
npm install

# Start development server
vercel dev
# Access at http://localhost:3000
```

### Production Deployment
1. Push code to GitHub repository
2. Import project on Vercel dashboard
3. Add environment variables:
   - `EMAIL_USER`: email address for SMTP authentication
   - `EMAIL_PASSWORD`: password for SMTP authentication
4. Deploy automatically via Vercel's GitHub integration

### Environment Variables
- `EMAIL_USER`: Defaults to `info@madrasbristol.com`
- `EMAIL_PASSWORD`: Defaults to `Madras@2026` (for development only)

## Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

### package.json
```json
{
  "name": "madras-bristol",
  "version": "1.0.0",
  "description": "Madras Bristol Restaurant Website",
  "main": "api/contact.js",
  "dependencies": {
    "nodemailer": "^6.9.3"
  },
  "keywords": ["restaurant", "madras", "bristol"]
}
```

## Migration Notes
The original PHP-based site (preserved in `madras-bristol-backup-aug10-2026/`) contained:
- PHP form processors (`contact.php`, `bookcontact.php`)
- PHP mail functions
- Server-side includes
- Different directory structure

The migration to Vercel involved:
1. Converting PHP pages to static HTML
2. Replacing PHP mail functionality with Node.js/Nodemailer
3. Creating serverless API endpoint for form handling
4. Setting up Vercel-specific routing and build configuration
5. Maintaining identical frontend design and user experience

## Security Considerations
- Environment variables protect email credentials
- Serverless functions execute in isolated Vercel environments
- Input validation prevents malformed requests
- HTTPS enforced by Vercel platform
- No sensitive data stored client-side

## Performance Optimizations
- Static asset serving via Vercel's CDN
- Minimal JavaScript dependencies
- Optimized image formats and sizes
- Browser caching through Vercel's edge network
- Efficient CSS delivery (critical rendering path consideration)

## Maintenance
- Content updates: Modify HTML files in `public/` directory
- Style changes: Edit CSS files in `public/css/`
- Functionality updates: Modify `api/contact.js` or add new API endpoints
- Dependency updates: Modify `package.json` and run `npm install`
- Configuration: Adjust `vercel.json` as needed for new routes or features

---
*Report generated: 2026-09-27*