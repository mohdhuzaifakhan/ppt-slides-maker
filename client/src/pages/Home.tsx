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

      // Define master slide with consistent branding
      pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: theme.background },
        objects: [
          // Footer line
          {
            line: {
              x: 0.5,
              y: 7.0,
              w: 9.0,
              h: 0,
              line: { color: theme.secondary, width: 2 },
            },
          },
          // Slide number
          {
            text: {
              text: "",
              options: {
                x: 9.0,
                y: 7.2,
                w: 0.5,
                h: 0.3,
                fontSize: 10,
                color: theme.lightText,
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
          createTitleSlide(pptSlide, slide, theme, index);
        } else if (slide.type === "content") {
          createContentSlide(pptSlide, slide, theme, index);
        } else if (slide.type === "section") {
          createSectionSlide(pptSlide, slide, theme, index);
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

  // const handleDownload = async () => {
  //   if (!presentation) return;

  //   try {
  //     const pptx = new PptxGenJS();

  //     presentation.slides.forEach((slide) => {
  //       const pptSlide = pptx.addSlide();

  //       if (slide.type === 'title') {
  //         pptSlide.addText(slide.title, {
  //           x: 0.5,
  //           y: 2.0,
  //           w: 9.0,
  //           h: 1.5,
  //           fontSize: 44,
  //           bold: true,
  //           color: '1F2937',
  //           align: 'center',
  //         });

  //         if (slide.subtitle) {
  //           pptSlide.addText(slide.subtitle, {
  //             x: 0.5,
  //             y: 3.5,
  //             w: 9.0,
  //             h: 0.8,
  //             fontSize: 24,
  //             color: '4B5563',
  //             align: 'center',
  //           });
  //         }
  //       } else if (slide.type === 'content') {
  //         pptSlide.addText(slide.title, {
  //           x: 0.5,
  //           y: 0.5,
  //           w: 9.0,
  //           h: 0.8,
  //           fontSize: 32,
  //           bold: true,
  //           color: '1F2937',
  //         });

  //         if (slide.content && slide.content.length > 0) {
  //           const bulletPoints = slide.content.map(item => ({ text: item }));
  //           pptSlide.addText(bulletPoints, {
  //             x: 0.5,
  //             y: 1.5,
  //             w: 9.0,
  //             h: 4.0,
  //             fontSize: 20,
  //             color: '374151',
  //             bullet: { code: '2022', color: '2563EB' },
  //           });
  //         }
  //       } else if (slide.type === 'section') {
  //         pptSlide.addText(slide.title, {
  //           x: 0.5,
  //           y: 2.5,
  //           w: 9.0,
  //           h: 1.0,
  //           fontSize: 36,
  //           bold: true,
  //           color: '1F2937',
  //           align: 'center',
  //         });
  //       }
  //     });

  //     const blob = await pptx.write({ outputType: 'blob' });
  //     saveAs(blob as Blob, `${presentation.title}.pptx`);

  //     toast({
  //       title: "Download Complete",
  //       description: "Your presentation has been downloaded successfully.",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Download Failed",
  //       description: "Failed to download presentation. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

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
