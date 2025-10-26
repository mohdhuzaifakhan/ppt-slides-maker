import { GoogleGenAI } from "@google/genai";
import { type Slide } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Using gemini-2.0-flash-exp model for presentation generation with enhanced capabilities

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDcyzoNQfwk6Q9aPFDVhn_SgDtAUVFzRkE'});

interface SlideGenerationResponse {
  title: string;
  slides: Slide[];
}

// Free stock photo APIs for images
const IMAGE_SOURCES = {
  unsplash: (query: string) => `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`,
  picsum: () => `https://picsum.photos/1600/900`,
};

// Generate contextual image URL based on slide content
function generateImageUrl(slide: Partial<Slide>, presentationTitle: string): string | undefined {
  // Only add images to title and section slides for visual impact
  if (slide.type === 'title') {
    const searchQuery = presentationTitle.toLowerCase()
      .replace(/presentation|slides|deck/gi, '')
      .trim();
    return IMAGE_SOURCES.unsplash(searchQuery || 'technology,business');
  }
  
  if (slide.type === 'section' && slide.title) {
    const searchQuery = slide.title.toLowerCase()
      .replace(/section|chapter/gi, '')
      .trim();
    return IMAGE_SOURCES.unsplash(searchQuery || 'abstract,minimal');
  }
  
  // Content slides can optionally have images based on content
  if (slide.type === 'content' && slide.title) {
    const keywords = slide.title.toLowerCase();
    // Add images for specific topics
    if (keywords.includes('benefit') || keywords.includes('advantage')) {
      return IMAGE_SOURCES.unsplash('success,growth');
    }
    if (keywords.includes('challenge') || keywords.includes('problem')) {
      return IMAGE_SOURCES.unsplash('solution,strategy');
    }
    if (keywords.includes('future') || keywords.includes('innovation')) {
      return IMAGE_SOURCES.unsplash('future,innovation');
    }
    if (keywords.includes('team') || keywords.includes('people')) {
      return IMAGE_SOURCES.unsplash('teamwork,collaboration');
    }
  }
  
  return undefined;
}

export async function generatePresentationFromPrompt(
  prompt: string
): Promise<SlideGenerationResponse> {
  try {
    const systemPrompt = `You are an expert presentation designer with years of experience creating engaging, professional PowerPoint presentations. Your slides are known for being visually appealing, well-structured, and impactful.

PRESENTATION GUIDELINES:
1. Create 6-10 slides for a comprehensive presentation
2. Start with an impactful title slide (type: "title") with a compelling title and subtitle
3. Include 1-3 section slides (type: "section") to divide major topics - these act as visual breaks
4. Most slides should be content slides (type: "content") with clear, actionable information
5. End with a strong conclusion or call-to-action slide

CONTENT QUALITY RULES:
- Title Slide: Create an attention-grabbing title and a subtitle that sets context
- Section Slides: Use short, powerful phrases (2-4 words) that introduce the next topic
- Content Slides: 
  * Each slide should have 3-6 bullet points (never more than 7)
  * Each bullet should be concise: 5-12 words maximum
  * Use action verbs and specific language
  * Avoid generic statements - be specific and valuable
  * Focus on insights, benefits, or actionable items
- Flow: Ensure logical progression from introduction → main content → conclusion

STYLE GUIDELINES:
- Use professional business language
- Be specific, not generic (e.g., "Increase conversion rates by 35%" not "Improve performance")
- Make it scannable - people should understand the key point in 2 seconds
- Use parallel structure in bullet points
- Vary content type: mix facts, statistics, benefits, and actionable steps

EXAMPLE STRUCTURE:
1. Title Slide: [Engaging Topic Name] + [Context/Benefit Subtitle]
2. Content: Introduction/Overview (3-4 bullets setting the stage)
3. Section: Core Concepts
4. Content: Main Component 1 (4-5 specific bullets)
5. Content: Main Component 2 (4-5 specific bullets)
6. Section: Implementation
7. Content: Practical Applications (4-5 bullets)
8. Content: Benefits & ROI (4-5 bullets with metrics if possible)
9. Content: Conclusion & Next Steps (3-4 bullets)

Return JSON in this exact format:
{
  "title": "Clear, Professional Presentation Title",
  "slides": [
    {
      "id": "unique-id-1",
      "type": "title",
      "title": "Compelling Main Title",
      "subtitle": "Context or value proposition in one sentence"
    },
    {
      "id": "unique-id-2", 
      "type": "content",
      "title": "Clear Slide Title (3-6 words)",
      "content": [
        "Specific, actionable bullet point 1",
        "Concrete example or data point 2",
        "Measurable outcome or benefit 3",
        "Clear action or insight 4"
      ]
    },
    {
      "id": "unique-id-3",
      "type": "section", 
      "title": "Section Title (2-4 words)"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["title", "content", "section"] },
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  content: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["id", "type", "title"],
              },
            },
          },
          required: ["title", "slides"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const data: SlideGenerationResponse = JSON.parse(rawJson);
      
      // Enhance slides with image URLs
      data.slides = data.slides.map(slide => ({
        ...slide,
        imageUrl: generateImageUrl(slide, data.title),
      }));
      
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.log("Quota exceeded, using fallback mock presentation");
      return generateMockPresentation(prompt);
    }
    
    throw new Error(`Failed to generate presentation: ${error.message || error}`);
  }
}

// Enhanced fallback mock presentation with images
function generateMockPresentation(prompt: string): SlideGenerationResponse {
  const topicMatch = prompt.match(/about\s+([^.?!]+)/i);
  const topic = topicMatch ? topicMatch[1].trim() : 'Your Topic';
  
  const slides: Slide[] = [
    {
      id: 'slide-1',
      type: 'title',
      title: topic,
      subtitle: 'A Comprehensive Overview',
      imageUrl: IMAGE_SOURCES.unsplash(topic),
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Introduction',
      content: [
        `${topic} is revolutionizing the industry`,
        'Understanding core principles and foundations',
        'Rapid growth and widespread adoption',
        'Key stakeholders and market dynamics',
      ],
    },
    {
      id: 'slide-3',
      type: 'section',
      title: 'Core Concepts',
      imageUrl: IMAGE_SOURCES.unsplash('abstract,technology'),
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Fundamental Components',
      content: [
        'Primary building blocks and architecture',
        'Integration points and dependencies',
        'Technical requirements and specifications',
        'Scalability and performance considerations',
        'Best practices and industry standards',
      ],
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Key Benefits',
      content: [
        'Increased efficiency by up to 40%',
        'Cost reduction through automation',
        'Enhanced user experience and satisfaction',
        'Competitive advantage in the market',
        'Measurable ROI within 6-12 months',
      ],
      imageUrl: IMAGE_SOURCES.unsplash('success,growth'),
    },
    {
      id: 'slide-6',
      type: 'section',
      title: 'Implementation',
      imageUrl: IMAGE_SOURCES.unsplash('strategy,planning'),
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'Practical Applications',
      content: [
        'Real-world use cases across industries',
        'Enterprise deployment strategies',
        'Small business implementation approaches',
        'Integration with existing systems',
      ],
    },
    {
      id: 'slide-8',
      type: 'content',
      title: 'Challenges & Solutions',
      content: [
        'Common obstacles and how to overcome them',
        'Resource allocation and budgeting',
        'Change management and team training',
        'Risk mitigation strategies',
      ],
      imageUrl: IMAGE_SOURCES.unsplash('solution,strategy'),
    },
    {
      id: 'slide-9',
      type: 'content',
      title: 'Next Steps',
      content: [
        'Conduct thorough needs assessment',
        'Develop phased implementation roadmap',
        'Allocate budget and resources',
        'Begin pilot program within 30 days',
        'Measure success with clear KPIs',
      ],
    },
  ];
  
  return {
    title: topic,
    slides,
  };
}

export async function updatePresentationSlides(
  prompt: string,
  currentSlides: Slide[],
  slideIndex?: number
): Promise<Slide[]> {
  try {
    const systemPrompt = `You are an expert presentation editor with a keen eye for improvement. Update the slides based on user feedback while maintaining professional quality and visual appeal.

CURRENT PRESENTATION:
${JSON.stringify(currentSlides, null, 2)}

${slideIndex !== undefined ? `FOCUS: The user wants to edit slide at index ${slideIndex}. Pay special attention to this slide.` : ""}

EDITING GUIDELINES:
1. Preserve slide IDs to maintain references (unless explicitly asked to add new slides)
2. Only modify what the user specifically requests
3. Maintain or improve the professional tone and clarity
4. If adding slides, generate new unique IDs (format: slide-{timestamp})
5. If removing slides, ensure the remaining presentation flows logically
6. Keep bullet points concise (5-12 words each)
7. Maintain parallel structure in lists
8. Ensure consistency in tone and style across all slides

QUALITY CHECKS:
- Are bullet points specific and actionable?
- Does the presentation flow logically?
- Is the language professional and engaging?
- Are there any grammar or clarity issues?
- Would this impress a business audience?

Return JSON array of ALL slides (updated + unchanged) in this format:
[
  {
    "id": "existing-or-new-id",
    "type": "title" | "content" | "section",
    "title": "Slide Title",
    "subtitle": "Optional Subtitle (for title slides only)",
    "content": ["Bullet 1", "Bullet 2", "..."] // for content slides only
  }
]

IMPORTANT: Return the complete array of all slides, not just the modified ones.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: ["title", "content", "section"] },
              title: { type: "string" },
              subtitle: { type: "string" },
              content: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["id", "type", "title"],
          },
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      let updatedSlides: Slide[] = JSON.parse(rawJson);
      
      // Preserve or add image URLs
      updatedSlides = updatedSlides.map((slide, index) => {
        const originalSlide = currentSlides.find(s => s.id === slide.id);
        return {
          ...slide,
          imageUrl: originalSlide?.imageUrl || generateImageUrl(slide, currentSlides[0]?.title || 'Presentation'),
        };
      });
      
      return updatedSlides;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.log("Quota exceeded during update, applying basic modification");
      const updatedSlides = currentSlides.map((slide, index) => {
        if (slideIndex !== undefined && index === slideIndex) {
          return {
            ...slide,
            title: slide.title + ' (Updated)',
          };
        }
        return slide;
      });
      return updatedSlides;
    }
    
    throw new Error(`Failed to update slides: ${error.message || error}`);
  }
}

// Helper function to regenerate a specific slide with better content
export async function regenerateSlide(
  slideIndex: number,
  currentSlides: Slide[],
  presentationTitle: string
): Promise<Slide> {
  const slide = currentSlides[slideIndex];
  const context = currentSlides
    .filter((_, idx) => idx !== slideIndex)
    .map(s => s.title)
    .join(', ');
  
  const prompt = `Regenerate slide "${slide.title}" in the context of a presentation about "${presentationTitle}". 
  Other slides in the presentation: ${context}.
  Make it more engaging, specific, and professional. Keep the same slide type (${slide.type}).`;
  
  const updatedSlides = await updatePresentationSlides(prompt, currentSlides, slideIndex);
  return updatedSlides[slideIndex];
}