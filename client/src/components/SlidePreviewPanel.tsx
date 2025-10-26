import { useState } from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Presentation,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideCanvas } from "./SlideCanvas";
import { type Presentation as pptType } from "@shared/schema";

interface SlidePreviewPanelProps {
  presentation: pptType | null;
  onDownload: () => void;
  isDownloading: boolean;
  onSlideSelect?: (index: number) => void;
  selectedSlideIndex?: number;
}

export function SlidePreviewPanel({
  presentation,
  onDownload,
  isDownloading,
  onSlideSelect,
  selectedSlideIndex = 0,
}: SlidePreviewPanelProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevious = () => {
    if (presentation && currentSlide > 0) {
      const newIndex = currentSlide - 1;
      setCurrentSlide(newIndex);
      onSlideSelect?.(newIndex);
    }
  };

  const handleNext = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      const newIndex = currentSlide + 1;
      setCurrentSlide(newIndex);
      onSlideSelect?.(newIndex);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    onSlideSelect?.(index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  if (!presentation) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Preview</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center mb-6">
            <Presentation className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Presentation Yet
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Start a conversation in the chat to generate your first presentation
            with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <h2
                className="text-base font-semibold text-gray-900 truncate"
                data-testid="text-presentation-title"
                title={presentation.title}
              >
                {presentation.title}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 ml-11">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {presentation.slides.length} slides
              </span>
              <span>•</span>
              <span>Slide {currentSlide + 1}</span>
            </div>
          </div>

          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
            data-testid="button-download-ppt"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download PPTX"}
          </Button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <SlideCanvas
            slide={presentation.slides[currentSlide]}
            slideNumber={currentSlide + 1}
            totalSlides={presentation.slides.length}
          />
        </div>
      </div>
      {/* Enhanced Thumbnail Strip */}
      {presentation.slides.length > 1 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">
              ALL SLIDES
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleThumbnailClick(index)}
                className={`group flex-shrink-0 w-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
                  currentSlide === index
                    ? "ring-3 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
                style={{ aspectRatio: "16/9" }}
                data-testid={`thumbnail-slide-${index}`}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
                  {/* Slide Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        slide.type === "title"
                          ? "bg-blue-100 text-blue-700"
                          : slide.type === "section"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {slide.type === "title"
                        ? "Title"
                        : slide.type === "section"
                        ? "Section"
                        : "Content"}
                    </span>
                  </div>

                  {/* Slide Title */}
                  <p className="text-xs font-semibold text-gray-900 line-clamp-3 text-center mt-6">
                    {slide.title}
                  </p>

                  {/* Slide Number Badge */}
                  <div className="absolute bottom-2 right-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        currentSlide === index
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white text-gray-600 group-hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
