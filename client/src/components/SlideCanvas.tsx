import { type Slide } from "@shared/schema";
import { useMemo } from "react";

interface SlideCanvasProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

// Theme configurations matching the PPT generator
const THEMES = [
  {
    name: 'Ocean Blue',
    primary: '#0F4C81',
    secondary: '#5B9BD5',
    accent: '#70AD47',
    background: '#FFFFFF',
    text: '#1F2937',
    lightText: '#6B7280',
    gradient: 'from-[#0F4C81] to-[#5B9BD5]'
  },
  {
    name: 'Sunset Glow',
    primary: '#E74C3C',
    secondary: '#F39C12',
    accent: '#E67E22',
    background: '#FFFFFF',
    text: '#2C3E50',
    lightText: '#7F8C8D',
    gradient: 'from-[#E74C3C] to-[#F39C12]'
  },
  {
    name: 'Forest Green',
    primary: '#27AE60',
    secondary: '#2ECC71',
    accent: '#16A085',
    background: '#FFFFFF',
    text: '#1E3A2F',
    lightText: '#5D6D5A',
    gradient: 'from-[#27AE60] to-[#2ECC71]'
  },
  {
    name: 'Purple Elegance',
    primary: '#8E44AD',
    secondary: '#9B59B6',
    accent: '#C39BD3',
    background: '#FFFFFF',
    text: '#2C3E50',
    lightText: '#7F8C8D',
    gradient: 'from-[#8E44AD] to-[#9B59B6]'
  },
  {
    name: 'Modern Dark',
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#3498DB',
    background: '#F8F9FA',
    text: '#1F2937',
    lightText: '#6B7280',
    gradient: 'from-[#2C3E50] to-[#34495E]'
  }
];

export function SlideCanvas({ slide, slideNumber, totalSlides }: SlideCanvasProps) {
  // Consistent theme selection based on slideNumber for stability
  const theme = useMemo(() => {
    return THEMES[slideNumber % THEMES.length];
  }, [slideNumber]);

  // Layout variations based on slide number
  const titleLayout = useMemo(() => {
    const layouts = ['centered', 'leftAligned', 'splitScreen', 'minimalist'];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  const contentLayout = useMemo(() => {
    const layouts = ['classic', 'twoColumn', 'featured', 'timeline'];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  const sectionLayout = useMemo(() => {
    const layouts = ['bold', 'diagonal', 'gradient', 'minimal'];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  return (
    <div 
      className="relative w-full rounded-lg overflow-hidden shadow-2xl" 
      style={{ aspectRatio: '16/9', backgroundColor: theme.background }}
    >
      {/* Title Slide Layouts */}
      {slide.type === 'title' && (
        <>
          {titleLayout === 'centered' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              {/* Decorative accent bar */}
              <div 
                className="w-64 h-1 mb-8 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              <h1 
                className="text-4xl md:text-6xl font-bold text-center mb-6"
                style={{ color: theme.primary }}
              >
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p 
                  className="text-lg md:text-2xl text-center max-w-3xl"
                  style={{ color: theme.lightText }}
                >
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}

          {titleLayout === 'leftAligned' && (
            <>
              {/* Large accent bar */}
              <div 
                className="absolute left-0 top-0 w-2 h-full"
                style={{ backgroundColor: theme.primary }}
              />
              <div className="absolute inset-0 flex flex-col justify-center p-12 pl-16">
                <h1 
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                  style={{ color: theme.primary }}
                >
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p 
                    className="text-xl md:text-2xl max-w-2xl"
                    style={{ color: theme.secondary }}
                  >
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </>
          )}

          {titleLayout === 'splitScreen' && (
            <>
              {/* Left half colored background */}
              <div 
                className="absolute left-0 top-0 w-1/2 h-full"
                style={{ backgroundColor: theme.primary }}
              />
              <div className="absolute inset-0 flex items-center">
                <div className="w-1/2" />
                <div className="w-1/2 p-12">
                  <h1 
                    className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                    style={{ color: theme.primary }}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p 
                      className="text-lg md:text-xl"
                      style={{ color: theme.lightText }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {titleLayout === 'minimalist' && (
            <div className="absolute inset-0 flex flex-col justify-center p-12 pl-20">
              <h1 
                className="text-5xl md:text-7xl font-bold mb-4"
                style={{ color: theme.text }}
              >
                {slide.title}
              </h1>
              {/* Underline accent */}
              <div 
                className="w-32 h-2 mb-6 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {slide.subtitle && (
                <p 
                  className="text-lg md:text-xl max-w-2xl"
                  style={{ color: theme.lightText }}
                >
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Content Slide Layouts */}
      {slide.type === 'content' && (
        <>
          {contentLayout === 'classic' && (
            <>
              {/* Header background */}
              <div 
                className="absolute top-0 left-0 right-0 h-20"
                style={{ backgroundColor: theme.primary }}
              >
                <h2 className="text-2xl md:text-4xl font-bold text-white p-6">
                  {slide.title}
                </h2>
              </div>
              <div className="absolute inset-0 pt-24 p-12">
                {slide.content && slide.content.length > 0 && (
                  <ul className="space-y-4">
                    {slide.content.map((item, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div 
                          className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span 
                          className="text-base md:text-xl flex-1 leading-relaxed"
                          style={{ color: theme.text }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {contentLayout === 'twoColumn' && (
            <div className="absolute inset-0 p-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: theme.primary }}
              >
                {slide.title}
              </h2>
              <div 
                className="w-full h-1 mb-8 rounded-full"
                style={{ backgroundColor: theme.secondary }}
              />
              {slide.content && slide.content.length > 0 && (
                <div className="grid grid-cols-2 gap-8">
                  <ul className="space-y-3">
                    {slide.content.slice(0, Math.ceil(slide.content.length / 2)).map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span 
                          className="text-sm md:text-lg flex-1"
                          style={{ color: theme.text }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-3">
                    {slide.content.slice(Math.ceil(slide.content.length / 2)).map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span 
                          className="text-sm md:text-lg flex-1"
                          style={{ color: theme.text }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {contentLayout === 'featured' && (
            <>
              {/* Side accent bar */}
              <div 
                className="absolute left-0 top-0 w-1 h-full"
                style={{ backgroundColor: theme.accent }}
              />
              <div className="absolute inset-0 p-12 pl-16">
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-10"
                  style={{ color: theme.primary }}
                >
                  {slide.title}
                </h2>
                {slide.content && slide.content.length > 0 && (
                  <div className="space-y-6">
                    {slide.content.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        {/* Number badge */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: theme.secondary }}
                        >
                          <span className="text-white font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <span 
                          className="text-base md:text-lg flex-1 pt-2"
                          style={{ color: theme.text }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {contentLayout === 'timeline' && (
            <div className="absolute inset-0 p-12">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-10"
                style={{ color: theme.primary }}
              >
                {slide.title}
              </h2>
              {slide.content && slide.content.length > 0 && (
                <div className="relative pl-12">
                  {/* Timeline line */}
                  <div 
                    className="absolute left-0 top-0 w-1 h-full rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div className="space-y-8">
                    {slide.content.map((item, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div 
                          className="absolute -left-14 top-2 w-6 h-6 rounded-full border-4"
                          style={{ 
                            backgroundColor: theme.accent,
                            borderColor: theme.background
                          }}
                        />
                        <p 
                          className="text-base md:text-lg"
                          style={{ color: theme.text }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Section Slide Layouts */}
      {slide.type === 'section' && (
        <>
          {sectionLayout === 'bold' && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-12">
                {slide.title}
              </h2>
            </div>
          )}

          {sectionLayout === 'diagonal' && (
            <>
              {/* Diagonal background */}
              <div 
                className="absolute -left-20 -top-10 w-2/3 h-full origin-top-left transform rotate-12"
                style={{ backgroundColor: theme.secondary }}
              />
              <div className="absolute inset-0 flex items-center p-12 pl-20">
                <h2 
                  className="text-4xl md:text-7xl font-bold leading-tight max-w-3xl"
                  style={{ color: theme.primary }}
                >
                  {slide.title}
                </h2>
              </div>
            </>
          )}

          {sectionLayout === 'gradient' && (
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
              <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-12 drop-shadow-2xl">
                {slide.title}
              </h2>
            </div>
          )}

          {sectionLayout === 'minimal' && (
            <div className="absolute inset-0 flex flex-col justify-center p-12 pl-20">
              <h2 
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: theme.primary }}
              >
                {slide.title}
              </h2>
              {/* Decorative line */}
              <div 
                className="w-48 h-2 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
          )}
        </>
      )}

      {/* Footer line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: theme.secondary }}
      />

      {/* Slide Number */}
      <div 
        className="absolute bottom-4 right-6 text-sm px-4 py-2 rounded-full backdrop-blur-sm"
        style={{ 
          color: theme.lightText,
          backgroundColor: `${theme.background}CC`
        }}
      >
        {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}