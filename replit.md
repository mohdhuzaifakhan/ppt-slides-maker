# AI PowerPoint Generator

## Overview

An AI-powered web application that generates professional PowerPoint presentations through conversational chat interactions. Users describe what they want in natural language, and the application uses Google's Gemini AI (specifically the gemini-2.5-pro-preview-05-06 model) to create complete presentation decks with structured slides. The application features a dual-pane interface with real-time preview and PowerPoint export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript 5, using Vite as the build tool and development server.

**UI Component System**: Built on shadcn/ui components (Material Design 3 influenced), which are Radix UI primitives styled with Tailwind CSS. The design follows a clean, modern aesthetic with careful attention to spacing, typography, and responsive behavior.

**State Management**: Uses TanStack Query (React Query) for server state management and caching. Local component state is managed with React hooks. No global state management library is used, keeping the architecture simple for this focused application.

**Routing**: Wouter for lightweight client-side routing (though the app is primarily single-page with the home route).

**Layout Strategy**: Implements a fixed dual-pane layout with 40% allocated to the chat interface (left) and 60% to the slide preview (right) on desktop. Mobile devices stack these vertically with the chat interface collapsing to a bottom sheet pattern.

**Styling Approach**: Tailwind CSS with extensive custom design tokens defined in CSS variables. Uses a combination of utility classes and component-specific styles. The theme system supports light and dark modes through CSS custom properties.

### Backend Architecture

**Runtime**: Node.js 20+ with Express.js framework for HTTP server.

**API Structure**: RESTful endpoints under `/api` prefix. Primary endpoints include:
- `POST /api/generate-slides` - Generate new presentation from text prompt
- Session management integrated into requests via optional sessionId parameter

**Session Management**: Uses in-memory storage (MemStorage class) for chat sessions, messages, and presentations during development. The storage interface (IStorage) is designed to be replaceable with a database-backed implementation.

**AI Integration**: Google Gemini AI via `@google/genai` SDK. Configured to use the gemini-2.5-pro-preview-05-06 model specifically. The AI receives structured prompts with explicit formatting requirements to generate JSON responses containing slide data.

**Presentation Export**: Client-side generation of PowerPoint files using pptxgenjs library, with file download handled via file-saver.

### Data Model

**Core Entities**:

1. **Message**: Chat messages with role (user/assistant), content, timestamp, and unique ID
2. **Slide**: Individual slide with type (title/content/section), title, optional content array, and optional subtitle
3. **Presentation**: Collection of slides with title, creation/update timestamps
4. **ChatSession**: Container for message history and associated presentation, with creation/update timestamps

**Data Flow**: Client sends prompt → Server validates with Zod schemas → Gemini AI generates structured response → Server creates/updates session → Client receives presentation data → Client renders preview and enables export.

### Type Safety

**Shared Schema**: TypeScript types are generated from Zod schemas defined in `shared/schema.ts`, ensuring type consistency between client and server. All API requests and responses are validated against these schemas.

### Design System

**Typography**: Uses Inter for UI elements and chat text, with a clear hierarchy defined through font size and weight scales. Slide content has its own typography rules optimized for presentation display.

**Color System**: Comprehensive color palette using HSL values in CSS custom properties. Supports semantic color names (primary, secondary, destructive, muted, accent) with automatic border color calculation and hover/active state elevation.

**Component Patterns**: Follows a consistent pattern for interactive elements with defined hover states, focus rings, and disabled states. Buttons use variance-based styling with multiple size and variant options.

## External Dependencies

### Third-Party APIs

**Google Gemini AI**: Core content generation service. Requires API key configured via environment variable `GEMINI_API_KEY`. The application uses the Developer API (not Vertex AI). Gemini receives carefully crafted system prompts that enforce specific JSON response formats for reliable slide generation.

### Key Libraries

**UI Components**:
- Radix UI - Unstyled, accessible component primitives
- Tailwind CSS - Utility-first styling framework
- class-variance-authority - Type-safe component variants
- Lucide React - Icon library

**Data Management**:
- TanStack Query - Server state management and caching
- Zod - Runtime type validation and schema definition
- React Hook Form - Form state management (via @hookform/resolvers)

**Presentation Generation**:
- pptxgenjs - PowerPoint file generation (client-side)
- file-saver - Browser file download functionality

**Development Tools**:
- Vite - Build tool and dev server with HMR
- TypeScript - Type safety across the stack
- ESBuild - Server-side bundling for production

### Database Preparation

The application currently uses in-memory storage but includes Drizzle ORM configuration and schema setup for PostgreSQL migration. Environment expects:
- `DATABASE_URL` - PostgreSQL connection string (for future use)
- Neon Database serverless driver configured but not actively used

The storage interface is designed to be swapped from MemStorage to a database-backed implementation without changing the API layer.

### Build and Deployment

**Development**: Single command (`npm run dev`) starts both Vite dev server with HMR and Express backend with tsx for TypeScript execution.

**Production**: Two-step build process - Vite builds client assets to `dist/public`, ESBuild bundles server code to `dist`. Production server serves pre-built static files and handles API requests.

**Environment Configuration**: Supports both traditional `.env` files and Replit Secrets for API keys and session secrets.