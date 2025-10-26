import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChatPanel } from "@/components/ChatPanel";
import { SlidePreviewPanel } from "@/components/SlidePreviewPanel";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  type Message,
  type Presentation,
  type GenerateSlidesResponse,
} from "@shared/schema";
import PptxGenJS from "pptxgenjs";
import { saveAs } from "file-saver";
import {
  createContentSlide,
  createSectionSlide,
  createTitleSlide,
  THEMES,
} from "@/make-ppt";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const pptx = new PptxGenJS();
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<
    number | undefined
  >(undefined);
  const { toast } = useToast();

  const generateSlidesMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/generate-slides", {
        prompt,
        sessionId: sessionId || undefined,
      });
      const data: GenerateSlidesResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.message]);
      setPresentation(data.presentation);
      if (!sessionId) {
        setSessionId(data.sessionId);
      }
      toast({
        title: "Presentation Generated",
        description: "Your slides are ready to preview and download.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description:
          error.message || "Failed to generate slides. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    generateSlidesMutation.mutate(content);
  };

  const handleDownload = async () => {
    if (!presentation) return;

    try {
      const pptx = new PptxGenJS();

      // Select a random theme for variety
      const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

      // Set presentation properties
      pptx.author = "AI Presentation Generator";
      pptx.company = "Your Company";
      pptx.subject = presentation.title;
      pptx.title = presentation.title;
      pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: theme.background },
        objects: [
          // 🔷 Top Header Bar
          {
            shape: pptx.ShapeType.rect,
            options: {
              x: 0,
              y: 0,
              w: "100%",
              h: 0.6,
              fill: { color: theme.primary },
            },
          },
          {
            text: {
              text: "Modern Presentation Template",
              options: {
                x: 0.6,
                y: 0.15,
                w: 8.5,
                h: 0.5,
                fontSize: 18,
                color: theme.lightText,
                bold: true,
                align: "left",
              },
            },
          },
          {
            line: {
              x: 0,
              y: 0.6,
              w: "100%",
              h: 0,
              line: { color: theme.secondary, width: 1.5 },
            },
          },

          {
            line: {
              x: 0.5,
              y: 7.0,
              w: 9.0,
              h: 0,
              line: { color: theme.secondary, width: 2 },
            },
          },

          {
            text: {
              text: "© 2025 EduTech Labs | All Rights Reserved",
              options: {
                x: 0.5,
                y: 7.15,
                w: 6,
                h: 0.3,
                fontSize: 10,
                color: theme.subtle,
                italic: true,
                align: "left",
              },
            },
          },

          {
            text: {
              text: "%slide%",
              options: {
                x: 9.0,
                y: 7.15,
                w: 0.5,
                h: 0.3,
                fontSize: 10,
                color: theme.subtle,
                align: "right",
              },
            },
          },
        ],
      });

      presentation.slides.forEach((slide: any, index: number) => {
        const pptSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

        // Add slide number
        pptSlide.addText(`${index + 1}`, {
          x: 9.0,
          y: 7.2,
          w: 0.5,
          h: 0.3,
          fontSize: 10,
          color: theme.lightText,
          align: "right",
        });

        if (slide.type === "title") {
          createTitleSlide(pptx, pptSlide, slide, theme, index);
        } else if (slide.type === "content") {
          createContentSlide(pptx, pptSlide, slide, theme, index);
        } else if (slide.type === "section") {
          createSectionSlide(pptx, pptSlide, slide, theme, index);
        }
      });

      const blob = await pptx.write({ outputType: "blob" });
      const timestamp = new Date().toISOString().slice(0, 10);
      saveAs(blob as Blob, `${presentation.title}_${timestamp}.pptx`);

      toast({
        title: "Download Complete",
        description: `Your presentation with ${theme.name} theme has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("PPT Generation Error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download presentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat Panel - 40% width on desktop */}
      <div className="w-full md:w-2/5 h-full">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={generateSlidesMutation.isPending}
          editingSlide={selectedSlideIndex}
        />
      </div>

      {/* Slide Preview Panel - 60% width on desktop */}
      <div className="hidden md:block md:w-3/5 h-full">
        <SlidePreviewPanel
          presentation={presentation}
          onDownload={handleDownload}
          isDownloading={false}
          onSlideSelect={setSelectedSlideIndex}
          selectedSlideIndex={selectedSlideIndex}
        />
      </div>
    </div>
  );
}
