# Replit Configuration

## Overview

This is a full-stack web application called "Vizag Traffic Pulse" - a predictive dashboard for urban traffic congestion analysis in Visakhapatnam. The project combines a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database integration using Drizzle ORM. The application analyzes traffic data to predict congestion patterns, identify accident hotspots, and provide insights for urban planning decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with a dark futuristic theme featuring neon gradients (blue, purple, red) and glassmorphism effects
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Layout**: Single-page application with navigation sections including Hero, About, Problem, Methodology, Results, Impact, Future, and Team

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Storage**: Dual storage strategy with in-memory storage for development and PostgreSQL for production
- **API Design**: RESTful endpoints for traffic data management, key indicators, and CSV data loading
- **Development Tools**: ESBuild for production bundling, tsx for development server

### Database Schema
- **Traffic Data Table**: Stores traffic records with fields for date, hour, location, queue density, stop density, accidents, fatalities, congestion score, and congestion level
- **Primary Key**: UUID-based auto-generated IDs for each traffic record
- **Data Types**: Supports timestamps, integers, real numbers, and text fields for comprehensive traffic analytics

### Data Processing
- **CSV Integration**: Ability to load traffic data from CSV files (vizag_traffic_data.csv)
- **Analytics**: Computation of key indicators including total accidents, total fatalities, and average congestion scores
- **Visualization**: Chart generation and display system for congestion distribution, hourly trends, daily patterns, heatmaps, and accident hotspots

### Development Environment
- **Build System**: Vite for frontend development with hot module replacement
- **TypeScript**: Full TypeScript support across frontend, backend, and shared schema definitions
- **Path Aliases**: Configured aliases for clean imports (@, @shared, @assets)
- **Development Plugins**: Replit-specific plugins for runtime error overlay, cartographer, and dev banner

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database system using Neon Database serverless PostgreSQL
- **Connection**: Environment variable-based database URL configuration
- **Migration**: Drizzle Kit for database schema migrations and management

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom color scheme and responsive design
- **Class Variance Authority**: For component variant management
- **Lucide React**: Icon library for consistent iconography

### Data and Analytics
- **Papa Parse**: CSV parsing library for processing traffic data files
- **Date-fns**: Date manipulation and formatting utilities
- **TanStack React Query**: Server state management and caching

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution environment for development
- **Drizzle Kit**: Database schema management and migration tools
- **Vite Plugins**: Development enhancement plugins including error overlay and debugging tools

### Third-party Integrations
- **Replit Platform**: Integrated development environment with specific plugins for enhanced development experience
- **Neon Database**: Serverless PostgreSQL hosting service for production database needs