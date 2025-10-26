# AI PowerPoint Generator

An AI-powered chat application for generating and editing PowerPoint presentations using Google's Gemini AI model. Built with React, TypeScript, Tailwind CSS, and Express.

![AI PowerPoint Generator](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🚀 Features

- **AI-Powered Generation**: Uses Gemini 2.5 Pro model to generate professional presentation content from natural language prompts
- **Chat Interface**: Intuitive chat-based UI similar to MagicSlides AI-Slide for seamless interaction
- **Real-time Preview**: Live preview of generated slides with 16:9 aspect ratio display
- **Slide Navigation**: Navigate through slides with thumbnail strip, arrow buttons, and keyboard shortcuts
- **PowerPoint Export**: Download presentations as `.pptx` files using pptxgenjs
- **Dynamic Editing**: Update and refine slides through conversational prompts
- **Professional Design**: Clean, modern UI with Material Design 3 principles
- **Responsive Layout**: Dual-pane desktop layout (40% chat / 60% preview), mobile-optimized stacking
- **Chat History**: Session-based message history preserved during active session

## 📋 Requirements

- Node.js 20 or higher
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-powerpoint-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

Create a `.env` file in the root directory or set up Replit Secrets:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=your_session_secret_here
```

**To get your Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste the key into your environment variables

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 💡 Usage Instructions

### Generating Your First Presentation

1. **Enter a Prompt**: Type a description of your presentation topic in the chat input
   - Example: "Create a presentation about Artificial Intelligence"
   - Example: "Make slides about the benefits of renewable energy"

2. **Wait for Generation**: The AI will process your request and generate 5-8 professional slides

3. **Preview Slides**: View your presentation in the right panel with:
   - Main slide canvas (16:9 aspect ratio)
   - Thumbnail navigation strip
   - Slide number indicator
   - Navigation arrows

4. **Download**: Click the "Download" button to export as `.pptx` file

### Editing Presentations

- **General Updates**: Send a new prompt to modify the entire presentation
  - Example: "Make the slides more technical"
  - Example: "Add a slide about challenges"

- **Slide-Specific Edits**: Click on a slide thumbnail, then send editing instructions
  - Example: "Rewrite this slide to focus on benefits"
  - Example: "Add more bullet points to this section"

### Navigation Controls

- **Thumbnail Strip**: Click any thumbnail to jump to that slide
- **Arrow Buttons**: Use left/right arrows beside the main canvas
- **Keyboard Shortcuts**: Use arrow keys for quick navigation
- **New Chat**: Click "New Chat" button to start a fresh presentation

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Wouter for routing
- TanStack Query for data fetching
- Shadcn/UI component library
- PptxGenJS for PowerPoint generation
- FileSaver for downloads

**Backend:**
- Express.js server
- Google Gemini AI SDK
- In-memory storage (MemStorage)
- TypeScript with strict type checking

### Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── SlidePreviewPanel.tsx
│   │   │   └── SlideCanvas.tsx
│   │   ├── pages/         # Page components
│   │   │   └── Home.tsx
│   │   ├── lib/           # Utilities
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Backend application
│   ├── routes.ts          # API endpoints
│   ├── gemini.ts          # AI integration
│   ├── storage.ts         # Data storage
│   └── index.ts           # Server entry
├── shared/                # Shared types
│   └── schema.ts          # TypeScript schemas
└── README.md
```

### Data Models

**Slide Types:**
- `title`: Title slide with heading and optional subtitle
- `content`: Content slide with title and bullet points
- `section`: Section divider with centered text

**API Endpoints:**
- `POST /api/generate-slides`: Generate new presentation from prompt
- `POST /api/update-slides`: Update existing presentation slides

## 🎨 Design Philosophy

The application follows Material Design 3 principles with Linear.app influences, emphasizing:

- **Clarity**: Clean typography hierarchy and ample whitespace
- **Efficiency**: Keyboard shortcuts and quick navigation
- **Professional Aesthetics**: Subtle shadows, rounded corners, and thoughtful spacing
- **Accessibility**: High contrast ratios, ARIA labels, focus states

### Color Scheme

- Primary: Blue (#3B82F6) for action elements
- Background: Light gray (#FAFAFA) for main canvas
- Card: Subtle white with soft borders
- Text: Gray scale for hierarchy (900, 600, 500)

## 🔧 Configuration

### Gemini Model Settings

The application uses `gemini-2.5-pro-preview-05-06` model with:
- JSON response mode for structured output
- System instructions for consistent formatting
- Schema validation for type safety

### Presentation Defaults

- **Slide Count**: 5-8 slides per presentation
- **Bullet Points**: 3-5 per content slide
- **Aspect Ratio**: 16:9 (standard PowerPoint)
- **Font Sizes**: 
  - Title slides: 44pt
  - Content titles: 32pt
  - Bullet points: 20pt

## 🚧 Assumptions Made

1. **Session Persistence**: Chat history is stored in-memory and resets on server restart
2. **Single User**: No authentication or multi-user support in current version
3. **English Language**: AI optimized for English prompts and content
4. **Desktop-First**: Primary experience optimized for desktop (1024px+)
5. **Browser Compatibility**: Modern browsers with ES2020+ support required

## 📝 API Response Format

The Gemini AI returns structured JSON matching this schema:

```typescript
{
  title: string;
  slides: [
    {
      id: string;
      type: "title" | "content" | "section";
      title: string;
      subtitle?: string;
      content?: string[];
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

**"Failed to generate slides" Error:**
- Verify your GEMINI_API_KEY is valid
- Check API quota limits at [Google AI Studio](https://aistudio.google.com/)
- Ensure internet connectivity

**Slides Not Appearing:**
- Check browser console for errors
- Verify backend is running on port 5000
- Clear browser cache and reload

**Download Not Working:**
- Allow pop-ups for the domain
- Check browser download permissions
- Verify sufficient disk space

## 🔮 Future Enhancements

- [ ] Persistent database storage with PostgreSQL
- [ ] Real-time streaming of slide generation progress
- [ ] PDF export option
- [ ] Custom theme/template selection
- [ ] Drag-and-drop slide reordering
- [ ] Image generation and insertion
- [ ] Multi-user collaboration
- [ ] Presentation history and version control
- [ ] Advanced editing tools (fonts, colors, layouts)

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Built with ❤️ using React, TypeScript, Gemini AI, and modern web technologies**
