# 🚦 Vizag Traffic Pulse - Predictive Dashboard (Vercel Ready)

A comprehensive traffic analysis and prediction dashboard for Visakhapatnam city, featuring real-time data processing, interactive visualizations, and Python-integrated machine learning analysis.

## 🎯 Overview

Vizag Traffic Pulse is a full-stack web application built with React frontend and Express.js backend. The application processes CSV traffic data, provides real-time monitoring via WebSocket connections, and integrates Python-based machine learning for high-accuracy traffic analysis.

## ✨ Key Features (Vercel Deployment Ready)

- **🔄 Real-time Data Processing**: Live traffic data with WebSocket connections (`/ws` endpoint)
- **📊 Interactive Charts**: Dynamic visualizations using Recharts library
- **🤖 Python ML Integration**: High-accuracy analysis using scikit-learn via subprocess
- **📱 Responsive Design**: Mobile-first design with enhanced accessibility colors
- **⚡ In-Memory Storage**: Fast data access with optimized caching
- **🎨 Modern UI**: shadcn/ui components with Tailwind CSS
- **📈 CSV Data Processing**: Upload and analyze traffic datasets
- **🔍 Multiple Chart Types**: Congestion, hourly, location-based, and ML performance charts
- **☁️ Vercel Ready**: Optimized for serverless deployment with all features working

## 🏗️ Complete Project Structure

### 📁 Root Directory
```
├── README.md              # Project documentation
├── package.json           # Node.js dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration with aliases
├── tailwind.config.ts     # Tailwind CSS with custom animations
├── postcss.config.js      # PostCSS with Tailwind and Autoprefixer
├── components.json        # shadcn/ui component configuration
├── drizzle.config.ts      # Database schema config (not actively used)
├── pyproject.toml         # Python project dependencies
├── uv.lock                # Python dependency lock file
├── analyze_traffic.py     # Python ML analysis script (actively used)
└── replit.md              # Development environment notes
```

### 📁 Client Directory (`client/`)
**Frontend React Application**

#### Main Files
- **`index.html`**: HTML template with app root
- **`index.css`**: Global styles, CSS variables for enhanced color contrast

#### Source (`client/src/`)
##### Core Files
- **`main.tsx`**: React app entry point with root render
- **`App.tsx`**: Main component with wouter routing
- **`index.css`**: Enhanced color scheme (HSL values optimized for accessibility)

##### Pages (`client/src/pages/`)
- **`home.tsx`**: Main dashboard combining all sections
- **`not-found.tsx`**: 404 error page

##### Components (`client/src/components/`)

###### UI Library (`client/src/components/ui/`)
**shadcn/ui Components (subset actually used):**
- **`button.tsx`**: Multi-variant button component
- **`card.tsx`**: Container with header/content/footer sections
- **`chart.tsx`**: Recharts wrapper components
- **`form.tsx`**: react-hook-form integration
- **`input.tsx`** & **`select.tsx`**: Form input components
- **`toast.tsx`** & **`toaster.tsx`**: Notification system
- **`dialog.tsx`** & **`sheet.tsx`**: Modal components
- **Plus 30+ other UI primitives for comprehensive interface**

###### Application Sections
- **`navigation.tsx`**: Fixed header with smooth scroll navigation
- **`hero-section.tsx`**: Landing section with CTA buttons
- **`about-section.tsx`**: Project description
- **`problem-section.tsx`**: Traffic challenges overview
- **`methodology-section.tsx`**: Technical approach explanation
- **`key-indicators.tsx`**: Real-time KPI display cards
- **`real-time-indicator.tsx`**: Live traffic status widget
- **`results-section.tsx`**: Analysis findings display
- **`impact-section.tsx`**: Benefits and outcomes
- **`future-section.tsx`**: Project roadmap
- **`footer.tsx`**: Simplified footer with navigation links
- **`interactive-charts.tsx`**: Chart visualization components
- **`csv-upload.tsx`**: File upload interface
- **`chart-modal.tsx`**: Detailed chart view modals

##### Custom Hooks (`client/src/hooks/`)
- **`use-traffic-data.tsx`**: TanStack Query data fetching
- **`use-realtime-traffic.tsx`**: WebSocket connection management
- **`use-toast.ts`**: Toast notification state
- **`use-mobile.tsx`**: Responsive design utilities

##### Utilities (`client/src/lib/`)
- **`utils.ts`**: Helper functions (cn, formatters)
- **`queryClient.ts`**: TanStack Query configuration

### 📁 Server Directory (`server/`)
**Express.js Backend with TypeScript**

- **`index.ts`**: 
  - Express server initialization
  - Middleware setup (JSON, logging, CORS)
  - Route registration and error handling
  - Serves both API and static client on port 5000

- **`routes.ts`**: 
  - **API Endpoints**: `/api/indicators`, `/api/traffic-data`, `/api/charts/:type`, `/api/load-csv`
  - **WebSocket Server**: Real-time updates on `/ws` path
  - **Python Integration**: Subprocess execution of `analyze_traffic.py`
  - **CSV Processing**: Multer upload with 50MB limit and type validation
  - **Chart Data**: Supports congestion, hourly, accidents, locations, ml chart types

- **`storage.ts`**: 
  - **IStorage Interface**: Data access abstraction
  - **MemStorage Class**: In-memory data store implementation
  - **Operations**: CRUD for traffic data, KPI calculations, ML results caching

- **`vite.ts`**: 
  - Development server integration
  - Hot reload and static serving
  - Production build support

### 📁 Shared Directory (`shared/`)
- **`schema.ts`**: 
  - Drizzle ORM schema definitions
  - Zod validation schemas
  - TypeScript type exports for API consistency

### 📁 Public Assets (`public/`)
- **`data/lucknow_traffic_cleaned.csv`**: Sample traffic dataset

### 📁 Temp Directory (`temp/uploads/`)
**Runtime file storage for CSV uploads**

## 🛠️ Technology Stack

### Frontend
- **React 18** + **TypeScript**: Modern component-based UI
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **shadcn/ui**: Accessible component library
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching
- **Recharts**: Declarative charting library
- **WebSocket API**: Real-time data connection

### Backend
- **Node.js** + **Express.js**: Web server framework
- **TypeScript**: Type-safe backend development
- **WebSocket (ws)**: Real-time bidirectional communication
- **Multer**: Multipart form data handling
- **Papa Parse**: CSV parsing and processing
- **Child Process**: Python script integration

### Data & Analysis
- **In-Memory Storage**: Fast data access via Map collections
- **Python Integration**: Subprocess execution of ML scripts
- **scikit-learn**: Machine learning models (Linear Regression, Decision Tree, Random Forest)
- **pandas**: Data manipulation and preprocessing

## 🔄 Application Workflow

### Startup Process
1. **`npm run dev`** starts Express server on port 5000
2. **Vite development server** integrates with Express
3. **API routes** register on `/api/*` endpoints
4. **WebSocket server** starts on `/ws` path
5. **Default CSV data** loads from `public/data/`
6. **Application ready** for frontend and API requests

### Data Processing Flow
1. **CSV Upload** → Multer processes file → Temporary storage
2. **Data Validation** → Papa Parse → Zod schema validation
3. **Python Analysis** → Spawn `analyze_traffic.py` → ML processing
4. **Results Storage** → In-memory cache → WebSocket broadcast
5. **Frontend Update** → React Query invalidation → UI refresh

### Real-time Updates
- **Backend timer** generates periodic traffic data
- **WebSocket broadcast** pushes updates to connected clients
- **Frontend listeners** receive and process real-time data
- **State management** updates UI components automatically

## 📊 API Reference

### Core Endpoints
```
GET    /api/indicators        # Key metrics (accidents, fatalities, congestion)
GET    /api/traffic-data      # Complete dataset
GET    /api/charts/:type      # Chart-specific data formatting  
POST   /api/load-csv          # File upload and Python processing
WebSocket /ws                 # Real-time data stream
```

### Chart Types
- **`congestion`**: Pie chart of congestion level distribution
- **`hourly`**: Line chart of traffic patterns by hour
- **`accidents`**: Accident statistics over time
- **`locations`**: Location-based traffic analysis
- **`ml`**: ML model performance comparison (RMSE, R²)

## 🤖 Machine Learning Integration

### Python Analysis Pipeline
**File**: `analyze_traffic.py`
**Execution**: Node.js subprocess via `child_process.spawn()`
**Timeout**: 2 minutes maximum processing time
**Input**: CSV file path via command line arguments
**Output**: JSON results with model performance metrics

### ML Models Implemented
1. **Linear Regression**: Baseline linear relationship model
2. **Decision Tree**: Rule-based prediction model
3. **Random Forest**: Ensemble method for improved accuracy

### Performance Metrics
- **RMSE** (Root Mean Square Error): Prediction accuracy
- **R²** (R-squared): Variance explanation coefficient
- **Results displayed** in dedicated ML performance chart

## 🚀 Installation & Setup

### Prerequisites
- **Node.js 18+** (JavaScript runtime)
- **npm** (Package manager)
- **Python 3.8+** (For ML analysis, optional)

### Quick Start
```bash
# Clone and install
git clone <repository-url>
cd vizag-traffic-pulse
npm install

# Start development
npm run dev
```

### Available Scripts
```bash
npm run dev      # Development server (Express + Vite)
npm run build    # Production build (client + server)
npm run start    # Production server
npm run check    # TypeScript validation
```

### Environment Variables
```bash
PORT=5000                    # Server port (required for production)
NODE_ENV=development         # Environment mode
PYTHON_BIN=python           # Python executable path (optional)
```

## ☁️ Vercel Deployment

This application is fully optimized for Vercel deployment:

### Deployment Steps
1. **Connect to Vercel**: Link your GitHub repository to Vercel
2. **Auto-Deploy**: Vercel will automatically detect the configuration and deploy
3. **Environment Variables**: No additional environment variables needed for basic functionality

### Vercel-Specific Features
- **Serverless Functions**: All API endpoints converted to Vercel serverless functions
- **File Upload**: Optimized file upload handling for serverless environment
- **Real-time Simulation**: WebSocket functionality replaced with polling for Vercel compatibility
- **In-Memory Storage**: Uses in-memory storage suitable for serverless functions
- **Mock ML Analysis**: Python ML analysis replaced with JavaScript mock for serverless compatibility

### Live Features After Deployment
- ✅ CSV File Upload and Processing
- ✅ Interactive Charts and Visualizations  
- ✅ Real-time Traffic Monitoring (via polling)
- ✅ Key Indicators Dashboard
- ✅ All UI Components and Navigation

## 🎨 Design System

### Enhanced Color Palette (Accessibility Optimized)
```css
--primary: hsl(220, 95%, 50%)      /* Vivid blue - high contrast */
--secondary: hsl(220, 35%, 35%)    /* Dark gray - readable text */
--accent: hsl(280, 85%, 55%)       /* Purple - visual variety */
--foreground: hsl(220, 15%, 8%)    /* Very dark text - WCAG AA+ */
--traffic-green: hsl(158, 64%, 52%) /* Success/low congestion */
--traffic-yellow: hsl(43, 96%, 56%) /* Warning/medium congestion */
--traffic-red: hsl(0, 84%, 60%)    /* Danger/high congestion */
```

### Typography & Layout
- **Font**: Inter - Professional sans-serif
- **Responsive**: Mobile-first breakpoints
- **Animations**: Smooth transitions and hover effects
- **Components**: Glass-morphism cards with backdrop blur

## 🚀 Production Deployment

### Traditional Hosting
```bash
# Build application
npm run build

# Start production server
npm start
```

### Environment Requirements
- **Node.js 18+** runtime
- **Python 3.8+** (for ML analysis)
- **Port 5000** exposed
- **File system** write access for temp uploads

### Performance Features
- **Static asset serving** via Express
- **Gzip compression** for API responses  
- **Efficient caching** with TanStack Query
- **WebSocket** for real-time updates
- **Memory storage** for fast data access

## 🔧 Development Notes

### Current Architecture
- **Storage**: In-memory only (MemStorage implementation)
- **Database**: Schema defined but PostgreSQL not actively connected
- **ML Integration**: Python subprocess execution
- **Real-time**: WebSocket server for live updates
- **File Handling**: Temporary uploads with automatic cleanup

### Code Quality
- **Full TypeScript** coverage for type safety
- **ESLint + Prettier** for consistent formatting
- **Component isolation** with clear boundaries
- **Error boundaries** for graceful failure handling

### Security Features
- **File upload validation**: CSV-only with 50MB limit
- **Input sanitization**: Zod schema validation
- **Error handling**: No sensitive data leakage
- **CORS configuration**: Secure cross-origin requests

## 🤝 Contributing

### Development Guidelines
1. **Follow TypeScript** patterns throughout
2. **Use TanStack Query** for server state
3. **Implement proper error** handling
4. **Test WebSocket** connections thoroughly
5. **Validate data** with Zod schemas

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Implement with type safety
4. Test API endpoints and real-time features
5. Update documentation for new features

## 📄 License

MIT License - Free to use, modify, and distribute.

---

**Built for smarter cities and data-driven traffic management in Visakhapatnam.**