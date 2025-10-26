import { type Slide } from "@shared/schema";

interface SlideCanvasProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

export function SlideCanvas({ slide, slideNumber, totalSlides }: SlideCanvasProps) {
  return (
    <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
        {slide.type === 'title' && (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 mt-4">
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {slide.type === 'content' && (
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {slide.title}
            </h2>
            {slide.content && slide.content.length > 0 && (
              <ul className="space-y-3">
                {slide.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-base md:text-lg text-gray-700 flex-1">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {slide.type === 'section' && (
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {slide.title}
            </h2>
          </div>
        )}
      </div>

      {/* Slide Number */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white/80 px-3 py-1 rounded">
        {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}
