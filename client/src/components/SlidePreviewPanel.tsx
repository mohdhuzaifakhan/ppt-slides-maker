import { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideCanvas } from "./SlideCanvas";
import { type Presentation } from "@shared/schema";

interface SlidePreviewPanelProps {
  presentation: Presentation | null;
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
  selectedSlideIndex = 0 
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

  if (!presentation) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between h-16 px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mt-4">
            No Presentation Yet
          </h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
            Start a conversation to generate your first presentation with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground truncate flex-1" data-testid="text-presentation-title">
          {presentation.title}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
            data-testid="button-download-ppt"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div className="relative w-full max-w-5xl">
          {/* Navigation Arrows */}
          {presentation.slides.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full z-10"
                onClick={handlePrevious}
                disabled={currentSlide === 0}
                data-testid="button-previous-slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full z-10"
                onClick={handleNext}
                disabled={currentSlide === presentation.slides.length - 1}
                data-testid="button-next-slide"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Slide Canvas */}
          <SlideCanvas
            slide={presentation.slides[currentSlide]}
            slideNumber={currentSlide + 1}
            totalSlides={presentation.slides.length}
          />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {presentation.slides.length > 1 && (
        <div className="h-32 border-t border-border p-4 bg-background">
          <div className="flex gap-3 overflow-x-auto h-full">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden hover-elevate transition-all ${
                  currentSlide === index 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ aspectRatio: '16/9' }}
                data-testid={`thumbnail-slide-${index}`}
              >
                <div className="w-full h-full flex items-center justify-center p-2">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 text-center">
                    {slide.title}
                  </p>
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-white/90 px-2 py-0.5 rounded">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
