# Design Guidelines: AI PowerPoint Chat Application

## Design Approach
**Selected Approach:** Design System - Material Design 3 with Linear.app influences
**Justification:** This is a productivity application requiring clarity, efficiency, and information density. Material Design provides excellent patterns for data-heavy interfaces, while Linear's clean aesthetics ensure modern appeal.

## Core Layout Architecture

### Dual-Pane Structure
- **Primary Layout:** Fixed split-screen with 40% left (chat) / 60% right (slides preview)
- **Chat Panel (Left):** Full-height sidebar with header, scrollable message area, and fixed input at bottom
- **Preview Panel (Right):** Header with controls, main slide canvas, and thumbnail strip at bottom
- **Responsive Behavior:** Stack vertically on mobile - chat collapses to bottom sheet, slides take full width

### Container System
- **Maximum widths:** Chat messages max-w-3xl, slide preview maintains 16:9 aspect ratio
- **Spacing primitives:** Use Tailwind units of 2, 4, 6, and 8 throughout (p-4, m-6, gap-8)
- **Section padding:** py-6 for compact sections, py-8 for standard sections

## Typography Hierarchy

**Font Stack:** 
- Primary: Inter (Google Fonts) - UI elements, chat messages
- Monospace: JetBrains Mono - code blocks, structured data

**Type Scale:**
- Hero/Page Titles: text-2xl font-semibold
- Section Headers: text-lg font-semibold
- Chat Messages: text-base font-normal
- Slide Titles: text-xl font-bold
- Slide Content: text-sm to text-base
- Metadata/Labels: text-xs font-medium uppercase tracking-wide
- Buttons: text-sm font-medium

## Component Library

### Chat Interface Components

**Chat Header:**
- Fixed top bar with application title (text-lg font-semibold)
- New conversation button (prominent, top-right)
- Height: h-16, border-bottom for separation
- Padding: px-6 py-4

**Message Bubbles:**
- User messages: Right-aligned, rounded-2xl, px-4 py-3, max-w-2xl
- AI responses: Left-aligned, rounded-2xl, px-4 py-3, max-w-3xl
- Spacing between messages: space-y-4
- Timestamp: text-xs, positioned below each message
- Avatar circles: w-8 h-8 for both user and AI

**Chat Input Area:**
- Fixed bottom position: sticky bottom-0
- Multi-line textarea with rounded-xl border
- Height: min-h-12, grows to max-h-32
- Send button: Icon button positioned absolute right-2 top-2
- Padding: p-4 around entire input container
- Shadow: subtle elevation (shadow-lg)

### Slide Preview Components

**Preview Header:**
- Toolbar with controls: Download, Edit Mode, Zoom controls
- Title area showing presentation name (text-lg font-semibold)
- Height: h-16, border-bottom
- Padding: px-6 py-4
- Button group: gap-2, text-sm buttons

**Main Canvas:**
- Slide display area with 16:9 aspect ratio maintained
- Centered within available space with max-w-5xl
- Shadow: shadow-2xl for depth
- Current slide number indicator: bottom-right corner, text-sm
- Navigation arrows: Positioned left and right of canvas (w-10 h-10 circular buttons)

**Thumbnail Strip:**
- Fixed bottom position, height: h-24
- Horizontal scroll with gap-3
- Each thumbnail: w-32 aspect-video, rounded-lg
- Active slide: Distinct border (border-2)
- Padding: p-4

### Slide Content Structure

**Title Slide:**
- Large centered title: text-3xl to text-4xl font-bold
- Subtitle: text-lg font-normal, mt-4
- Generous vertical spacing

**Content Slides:**
- Slide title: text-2xl font-bold, mb-6
- Bullet points: text-base, space-y-2, pl-6
- Maximum 4-5 bullets per slide for readability
- Icons for bullet points: w-5 h-5 inline-flex

**Section Dividers:**
- Large centered text: text-2xl font-semibold
- Minimal content for visual break

### Utility Components

**Loading States:**
- Slide generation: Skeleton screens with pulse animation
- Chat responses: Typing indicator with three animated dots (gap-1)
- Progress bar for multi-slide generation: h-2 rounded-full

**Empty States:**
- Centered content with icon (w-16 h-16)
- Heading: text-xl font-semibold, mt-4
- Description: text-sm, mt-2
- CTA button: mt-6

**Download Modal:**
- Centered overlay with rounded-2xl container
- Format selection: Radio buttons with gap-4
- Action buttons: gap-3, full-width on mobile

## Navigation & Interaction Patterns

**Chat History Sidebar (Optional Toggle):**
- Collapsible left drawer, w-64
- List of previous conversations with truncated titles
- Each item: px-4 py-3, rounded-lg, truncate
- Active conversation highlighted

**Slide Navigation:**
- Keyboard shortcuts display on first load (overlay tutorial)
- Click thumbnails for direct navigation
- Arrow keys for sequential navigation

**Edit Workflow:**
- Click slide to focus → Chat input shows "Editing Slide 3"
- Context-aware prompts in input placeholder
- Undo/redo buttons in preview header

## Spacing & Rhythm

**Vertical Spacing:**
- Between major sections: mt-8 to mt-12
- Within components: mt-4 to mt-6
- Element groups: gap-4

**Horizontal Spacing:**
- Container padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Grid gaps: gap-4 standard, gap-6 for larger items
- Button groups: gap-2 for tight grouping, gap-4 for separated actions

## Responsive Breakpoints

**Mobile (< 768px):**
- Single column stack: Chat full-width, slides in bottom sheet
- Chat input: Fixed with backdrop overlay when slides visible
- Thumbnail strip: Hidden, use swipe for navigation

**Tablet (768px - 1024px):**
- Split view: 50/50 chat and preview
- Collapsible chat sidebar option
- Thumbnail strip: Vertical on right edge

**Desktop (> 1024px):**
- Full dual-pane: 40/60 split
- All features visible simultaneously
- Optional third panel for chat history

## Accessibility & Polish

**Focus States:**
- All interactive elements: ring-2 ring-offset-2
- Skip to content link for keyboard navigation
- ARIA labels on all icon-only buttons

**Visual Hierarchy:**
- Clear content separation with subtle borders
- Elevation system: shadow-sm (cards), shadow-md (modals), shadow-lg (fixed elements)
- Consistent border-radius: rounded-lg (standard), rounded-xl (larger containers), rounded-2xl (modals)

**Micro-interactions:**
- Button hover: Subtle scale (scale-105) on primary actions only
- Slide selection: Smooth highlight transition
- Message send: Brief success feedback

This design creates a professional, efficient workspace for AI-powered presentation creation, balancing information density with clarity and ease of use.