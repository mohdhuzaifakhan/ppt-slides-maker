import { type Slide } from "@shared/schema";
import { useMemo } from "react";

interface SlideCanvasProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

const THEMES = [
  {
    name: "Ocean Blue",
    primary: "#1E40AF",
    secondary: "#3B82F6",
    accent: "#60A5FA",
    background: "#FFFFFF",
    text: "#1F2937",
    lightText: "#6B7280",
    overlay: "rgba(30, 64, 175, 0.85)",
    gradient: "from-blue-600 via-blue-500 to-blue-400",
  },
  {
    name: "Sunset Glow",
    primary: "#DC2626",
    secondary: "#F59E0B",
    accent: "#FBBF24",
    background: "#FFFFFF",
    text: "#1F2937",
    lightText: "#6B7280",
    overlay: "rgba(220, 38, 38, 0.85)",
    gradient: "from-red-600 via-orange-500 to-amber-400",
  },
  {
    name: "Forest Green",
    primary: "#059669",
    secondary: "#10B981",
    accent: "#34D399",
    background: "#FFFFFF",
    text: "#1F2937",
    lightText: "#6B7280",
    overlay: "rgba(5, 150, 105, 0.85)",
    gradient: "from-emerald-600 via-green-500 to-emerald-400",
  },
  {
    name: "Purple Elegance",
    primary: "#7C3AED",
    secondary: "#A78BFA",
    accent: "#C4B5FD",
    background: "#FFFFFF",
    text: "#1F2937",
    lightText: "#6B7280",
    overlay: "rgba(124, 58, 237, 0.85)",
    gradient: "from-violet-600 via-purple-500 to-purple-400",
  },
  {
    name: "Modern Dark",
    primary: "#1F2937",
    secondary: "#4B5563",
    accent: "#3B82F6",
    background: "#F9FAFB",
    text: "#111827",
    lightText: "#6B7280",
    overlay: "rgba(31, 41, 55, 0.85)",
    gradient: "from-gray-800 via-gray-700 to-gray-600",
  },
];

export function SlideCanvas({
  slide,
  slideNumber,
  totalSlides,
}: SlideCanvasProps) {
  const theme = useMemo(() => {
    return THEMES[slideNumber % THEMES.length];
  }, [slideNumber]);

  const titleLayout = useMemo(() => {
    const layouts = ["centered", "leftAligned", "splitScreen", "minimalist"];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  const contentLayout = useMemo(() => {
    const layouts = ["classic", "twoColumn", "featured", "timeline"];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  const sectionLayout = useMemo(() => {
    const layouts = ["bold", "diagonal", "gradient", "minimal"];
    return layouts[slideNumber % layouts.length];
  }, [slideNumber]);

  return (
    <div
      className="relative rounded-sm mx-2 w-[600px] h-[300px] overflow-hidden"
      style={{
        backgroundColor: theme.background,
      }}
    >
      {slide.type === "title" && (
        <>
          {/* --- Background --- */}
          {slide.imageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  filter: "brightness(0.35)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
            </>
          )}

          {/* --- Centered Layout --- */}
          {titleLayout === "centered" && (
            <div className="absolute inset-0 flex flex-col justify-center items-center px-6 z-10 text-center">
              <h1
                className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
                style={{
                  color: slide.imageUrl ? "#FFFFFF" : theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                }}
              >
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p
                  className="text-lg md:text-2xl font-medium opacity-90 max-w-3xl"
                  style={{
                    color: slide.imageUrl
                      ? "rgba(255, 255, 255, 0.9)"
                      : theme.lightText,
                    fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  }}
                >
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}

          {/* --- Left Aligned Layout --- */}
          {titleLayout === "leftAligned" && (
            <>
              {!slide.imageUrl && (
                <div
                  className="absolute left-0 top-0 w-2 h-full"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-center p-12 pl-16 z-10 text-left">
                <h1
                  className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                  style={{
                    color: slide.imageUrl ? "#FFFFFF" : theme.primary,
                    fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  }}
                >
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p
                    className="text-lg md:text-2xl max-w-2xl opacity-90"
                    style={{
                      color: slide.imageUrl
                        ? "rgba(255, 255, 255, 0.85)"
                        : theme.secondary,
                      fontFamily: "Poppins, Inter, system-ui, sans-serif",
                    }}
                  >
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </>
          )}

          {/* --- Split Screen Layout --- */}
          {titleLayout === "splitScreen" && (
            <>
              <div
                className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center"
                style={{
                  backgroundImage: slide.imageUrl
                    ? `url(${slide.imageUrl})`
                    : "none",
                  backgroundColor: !slide.imageUrl ? theme.primary : undefined,
                }}
              />
              <div className="absolute inset-0 flex items-center z-10">
                <div className="w-1/2" />
                <div className="w-1/2 p-16">
                  <h1
                    className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                    style={{
                      color: theme.primary,
                      fontFamily: "Poppins, Inter, system-ui, sans-serif",
                    }}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p
                      className="text-lg md:text-2xl leading-relaxed opacity-90"
                      style={{
                        color: theme.lightText,
                        fontFamily: "Poppins, Inter, system-ui, sans-serif",
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* --- Minimalist Layout --- */}
          {titleLayout === "minimalist" && (
            <div className="absolute inset-0 flex flex-col justify-center p-16 pl-20 z-10">
              <h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
                style={{
                  color: slide.imageUrl ? "#FFFFFF" : theme.text,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                }}
              >
                {slide.title}
              </h1>
              <div
                className="w-32 h-1.5 mb-6 rounded-full"
                style={{
                  backgroundColor: slide.imageUrl ? "#FFFFFF" : theme.accent,
                }}
              />
              {slide.subtitle && (
                <p
                  className="text-lg md:text-2xl max-w-3xl leading-relaxed opacity-90"
                  style={{
                    color: slide.imageUrl
                      ? "rgba(255, 255, 255, 0.9)"
                      : theme.lightText,
                    fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  }}
                >
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Content Slide Layouts */}
      {slide.type === "content" && (
        <>
          {/* Classic Layout */}
          {contentLayout === "classic" && (
            <div
              className="absolute inset-0 flex flex-col justify-center p-8 gap-4"
              style={{ minHeight: "100%" }}
            >
              {/* Header */}
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4 text-center"
                style={{
                  color: theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.title}
              </h2>

              {/* Content */}
              <div className="flex gap-6 items-center">
                {slide.imageUrl && (
                  <div className="w-2/5 flex-shrink-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                  </div>
                )}
                {slide.content && slide.content.length > 0 && (
                  <ul className="space-y-1 flex-1">
                    {slide.content.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span
                          className="text-md md:text-md flex-1"
                          style={{
                            color: theme.text,
                            fontFamily: "Poppins, Inter, system-ui, sans-serif",
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          {contentLayout === "twoColumn" && (
            <div className="absolute inset-0 flex flex-col justify-center p-8 gap-4">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4 text-center"
                style={{
                  color: theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.title}
              </h2>
              <div
                className="w-full h-0.5 mb-4 rounded-full mx-auto"
                style={{ backgroundColor: theme.secondary, opacity: 0.3 }}
              />
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((col) => (
                  <ul className="space-y-1" key={col}>
                    {slide.content
                      .slice(
                        col * Math.ceil(slide.content.length / 2),
                        (col + 1) * Math.ceil(slide.content.length / 2)
                      )
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: theme.accent }}
                          />
                          <span
                            className="text-md md:text-md"
                            style={{
                              color: theme.text,
                              fontFamily:
                                "Poppins, Inter, system-ui, sans-serif",
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                  </ul>
                ))}
              </div>
            </div>
          )}

          {/* Featured Layout */}
          {contentLayout === "featured" && (
            <div className="absolute inset-0 flex flex-col justify-center p-8 gap-4">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-3 text-center"
                style={{
                  color: theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.title}
              </h2>
              <div className="space-y-1">
                {slide.content.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      }}
                    >
                      <span className="text-white font-semibold text-md">
                        {index + 1}
                      </span>
                    </div>
                    <span
                      className="text-md md:text-md"
                      style={{
                        color: theme.text,
                        fontFamily: "Poppins, Inter, system-ui, sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Layout */}
          {contentLayout === "timeline" && (
            <div className="absolute inset-0 flex flex-col justify-center p-8 gap-4">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-3 text-center"
                style={{
                  color: theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {slide.title}
              </h2>
              <div className="relative">
                <div className="space-y-1">
                  {slide.content.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: theme.accent,
                          borderColor: theme.background,
                        }}
                      />
                      <p
                        className="text-md md:text-md"
                        style={{
                          color: theme.text,
                          fontFamily: "Poppins, Inter, system-ui, sans-serif",
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {slide.type === "section" && (
        <>
          {slide.imageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  filter: "brightness(0.35)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: theme.overlay }}
              />
            </>
          )}

          {sectionLayout === "bold" && (
            <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
              <h2
                className="text-4xl md:text-5xl font-extrabold text-center leading-tight"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                {slide.title}
              </h2>
            </div>
          )}

          {sectionLayout === "diagonal" && (
            <>
              {!slide.imageUrl && (
                <div
                  className="absolute -left-16 -top-12 w-2/3 h-full origin-top-left transform rotate-12 rounded-xl"
                  style={{ backgroundColor: theme.secondary, opacity: 0.85 }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center px-8 z-10">
                <h2
                  className="text-4xl md:text-5xl font-extrabold leading-tight text-center max-w-3xl"
                  style={{
                    color: slide.imageUrl ? "#FFFFFF" : theme.primary,
                    fontFamily: "Poppins, Inter, system-ui, sans-serif",
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  {slide.title}
                </h2>
              </div>
            </>
          )}

          {sectionLayout === "gradient" && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-10 px-6 ${
                !slide.imageUrl ? `bg-gradient-to-br ${theme.gradient}` : ""
              }`}
            >
              <h2
                className="text-4xl md:text-5xl font-extrabold text-center leading-tight"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 16px rgba(0,0,0,0.35)",
                }}
              >
                {slide.title}
              </h2>
            </div>
          )}

          {/* Minimal Layout */}
          {sectionLayout === "minimal" && (
            <div className="absolute inset-0 flex flex-col justify-center items-start px-12 md:px-20 z-10">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                style={{
                  color: slide.imageUrl ? "#FFFFFF" : theme.primary,
                  fontFamily: "Poppins, Inter, system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.2)",
                }}
              >
                {slide.title}
              </h2>
              <div
                className="w-48 h-1.5 rounded-full"
                style={{
                  backgroundColor: slide.imageUrl ? "#FFFFFF" : theme.accent,
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Subtle Footer Line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: theme.secondary, opacity: 0.2 }}
      />

      {/* Slide Number Badge */}
      <div
        className="absolute bottom-5 right-6 text-sm font-medium px-4 py-2 rounded-lg backdrop-blur-sm"
        style={{
          color: theme.lightText,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}
