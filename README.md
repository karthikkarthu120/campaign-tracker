# Campaign Tracker

## 🚀 Features

- **User Authentication**: Secure login and registration system with client-side validation
- **Campaign Management**: Create, edit, and track marketing campaigns
- **Real-time Search**: Filter campaigns by name or client
- **Status Management**: Update campaign status (Active, Paused, Completed)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Data Persistence**: localStorage for user sessions, MySQL/in-memory fallback for campaigns

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with CSS variables
- **HTML5** - Semantic markup

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Primary database (with in-memory fallback)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📂 Project Structure

```
campaign-tracker/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   └── Campaign.js          # Campaign data model
│   ├── routes/
│   │   └── campaigns.js         # Campaign API routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CampaignForm.js  # Campaign creation form
│   │   │   ├── CampaignList.js  # Campaign display list
│   │   │   ├── HomePage.js      # Landing page
│   │   │   └── Login.js         # Authentication
│   │   ├── services/
│   │   │   └── campaignService.js # API service layer
│   │   ├── App.js               # Main application component
│   │   ├── App.css              # Global styles
│   │   └── neon-theme.css       # Theme variables
│   └── package.json
└── README.md
```

## 🧪 Development

### Frontend Development
```bash
cd frontend
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

### Backend Development
```bash
cd backend
npm start        # Start server with nodemon
npm run dev      # Development mode with auto-restart
```

## 🚀 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your web server
```

### Backend
```bash
cd backend
# Set NODE_ENV=production in your environment
# Configure your database settings
# Start with: npm start
```