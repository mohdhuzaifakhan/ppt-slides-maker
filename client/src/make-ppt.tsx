import PptxGenJS from "pptxgenjs";
import { saveAs } from "file-saver";
// Theme configurations with modern color palettes
export const THEMES = [
  {
    name: "Ocean Blue",
    primary: "0F4C81",
    secondary: "5B9BD5",
    accent: "70AD47",
    background: "FFFFFF",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["0F4C81", "5B9BD5"],
  },
  {
    name: "Sunset Glow",
    primary: "E74C3C",
    secondary: "F39C12",
    accent: "E67E22",
    background: "FFFFFF",
    text: "2C3E50",
    lightText: "7F8C8D",
    gradient: ["E74C3C", "F39C12"],
  },
  {
    name: "Forest Green",
    primary: "27AE60",
    secondary: "2ECC71",
    accent: "16A085",
    background: "FFFFFF",
    text: "1E3A2F",
    lightText: "5D6D5A",
    gradient: ["27AE60", "2ECC71"],
  },
  {
    name: "Purple Elegance",
    primary: "8E44AD",
    secondary: "9B59B6",
    accent: "C39BD3",
    background: "FFFFFF",
    text: "2C3E50",
    lightText: "7F8C8D",
    gradient: ["8E44AD", "9B59B6"],
  },
  {
    name: "Modern Dark",
    primary: "2C3E50",
    secondary: "34495E",
    accent: "3498DB",
    background: "F8F9FA",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["2C3E50", "34495E"],
  },
];

// Layout configurations for different slide types
export const LAYOUTS = {
  title: ["centered", "leftAligned", "splitScreen", "minimalist"],
  content: ["classic", "twoColumn", "iconBased", "timeline", "featured"],
  section: ["bold", "diagonal", "gradient", "minimal"],
};

const handleDownload = async (presentation: any) => {
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

// Title slide with multiple dynamic layouts
export const createTitleSlide = (slide: any, data: any, theme: any, index: number) => {
  const layouts = ["centered", "leftAligned", "splitScreen", "minimalist"];
  const layout = layouts[index % layouts.length];

  // Add decorative gradient rectangle
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 7.5,
    fill: {
      type: "solid",
      color: theme.background,
      transparency: 0,
    },
  });

  switch (layout) {
    case "centered":
      // Decorative accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 2.5,
        y: 1.8,
        w: 5.0,
        h: 0.05,
        fill: { color: theme.accent },
      });

      slide.addText(data.title, {
        x: 0.5,
        y: 2.2,
        w: 9.0,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: theme.primary,
        align: "center",
        fontFace: "Arial",
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 0.5,
          y: 4.0,
          w: 9.0,
          h: 0.8,
          fontSize: 22,
          color: theme.lightText,
          align: "center",
          fontFace: "Arial",
        });
      }
      break;

    case "leftAligned":
      // Large accent shape
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.3,
        h: 7.5,
        fill: { color: theme.primary },
      });

      slide.addText(data.title, {
        x: 0.8,
        y: 2.5,
        w: 8.5,
        h: 1.5,
        fontSize: 52,
        bold: true,
        color: theme.primary,
        align: "left",
        fontFace: "Arial",
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 0.8,
          y: 4.2,
          w: 8.5,
          h: 0.8,
          fontSize: 24,
          color: theme.secondary,
          align: "left",
          fontFace: "Arial",
        });
      }
      break;

    case "splitScreen":
      // Left half colored background
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 5.0,
        h: 7.5,
        fill: { color: theme.primary },
      });

      slide.addText(data.title, {
        x: 5.3,
        y: 2.5,
        w: 4.2,
        h: 1.8,
        fontSize: 44,
        bold: true,
        color: theme.primary,
        align: "left",
        fontFace: "Arial",
        lineSpacing: 38,
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 5.3,
          y: 4.5,
          w: 4.2,
          h: 1.0,
          fontSize: 20,
          color: theme.lightText,
          align: "left",
          fontFace: "Arial",
        });
      }
      break;

    case "minimalist":
      slide.addText(data.title, {
        x: 1.0,
        y: 3.0,
        w: 8.0,
        h: 1.2,
        fontSize: 56,
        bold: true,
        color: theme.text,
        align: "left",
        fontFace: "Arial",
      });

      // Underline accent
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: 4.3,
        w: 2.0,
        h: 0.08,
        fill: { color: theme.accent },
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.0,
          y: 4.6,
          w: 8.0,
          h: 0.6,
          fontSize: 20,
          color: theme.lightText,
          align: "left",
          fontFace: "Arial",
        });
      }
      break;
  }
};

// Content slide with dynamic layouts
export const createContentSlide = (
  slide: any,
  data: any,
  theme: any,
  index: number
) => {
  const layouts = ["classic", "twoColumn", "featured", "timeline"];
  const layout = layouts[index % layouts.length];

  switch (layout) {
    case "classic":
      // Header background
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 1.2,
        fill: { color: theme.primary },
      });

      slide.addText(data.title, {
        x: 0.5,
        y: 0.3,
        w: 9.0,
        h: 0.6,
        fontSize: 36,
        bold: true,
        color: "FFFFFF",
        fontFace: "Arial",
      });

      if (data.content && data.content.length > 0) {
        const bulletPoints = data.content.map((item: string) => ({
          text: item,
          options: { breakLine: true },
        }));

        slide.addText(bulletPoints, {
          x: 0.8,
          y: 1.8,
          w: 8.4,
          h: 5.0,
          fontSize: 18,
          color: theme.text,
          bullet: {
            type: "number",
            numberType: "circle",
            color: theme.accent,
            style: "●",
          },
          lineSpacing: 28,
          fontFace: "Arial",
        });
      }
      break;

    case "twoColumn":
      // Title with underline
      slide.addText(data.title, {
        x: 0.5,
        y: 0.4,
        w: 9.0,
        h: 0.7,
        fontSize: 34,
        bold: true,
        color: theme.primary,
        fontFace: "Arial",
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.1,
        w: 9.0,
        h: 0.03,
        fill: { color: theme.secondary },
      });

      if (data.content && data.content.length > 0) {
        const midPoint = Math.ceil(data.content.length / 2);
        const leftContent = data.content.slice(0, midPoint);
        const rightContent = data.content.slice(midPoint);

        // Left column
        const leftBullets = leftContent.map((item: string) => ({ text: item }));
        slide.addText(leftBullets, {
          x: 0.6,
          y: 1.7,
          w: 4.2,
          h: 5.0,
          fontSize: 17,
          color: theme.text,
          bullet: { code: "2022", color: theme.accent },
          lineSpacing: 26,
          fontFace: "Arial",
        });

        // Right column
        if (rightContent.length > 0) {
          const rightBullets = rightContent.map((item: string) => ({
            text: item,
          }));
          slide.addText(rightBullets, {
            x: 5.2,
            y: 1.7,
            w: 4.2,
            h: 5.0,
            fontSize: 17,
            color: theme.text,
            bullet: { code: "2022", color: theme.accent },
            lineSpacing: 26,
            fontFace: "Arial",
          });
        }
      }
      break;

    case "featured":
      // Side accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.15,
        h: 7.5,
        fill: { color: theme.accent },
      });

      slide.addText(data.title, {
        x: 0.5,
        y: 0.5,
        w: 9.0,
        h: 0.8,
        fontSize: 36,
        bold: true,
        color: theme.primary,
        fontFace: "Arial",
      });

      if (data.content && data.content.length > 0) {
        data.content.forEach((item: string, idx: number) => {
          // Number badge
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 0.8,
            y: 1.7 + idx * 0.9,
            w: 0.4,
            h: 0.4,
            fill: { color: theme.secondary },
          });

          slide.addText(`${idx + 1}`, {
            x: 0.8,
            y: 1.7 + idx * 0.9,
            w: 0.4,
            h: 0.4,
            fontSize: 16,
            bold: true,
            color: "FFFFFF",
            align: "center",
            valign: "middle",
            fontFace: "Arial",
          });

          slide.addText(item, {
            x: 1.4,
            y: 1.75 + idx * 0.9,
            w: 7.8,
            h: 0.7,
            fontSize: 17,
            color: theme.text,
            fontFace: "Arial",
          });
        });
      }
      break;

    case "timeline":
      slide.addText(data.title, {
        x: 0.5,
        y: 0.4,
        w: 9.0,
        h: 0.7,
        fontSize: 34,
        bold: true,
        color: theme.primary,
        fontFace: "Arial",
      });

      // Timeline line
      slide.addShape(pptx.ShapeType.rect, {
        x: 1.5,
        y: 1.5,
        w: 0.05,
        h: 5.2,
        fill: { color: theme.secondary },
      });

      if (data.content && data.content.length > 0) {
        data.content.forEach((item: string, idx: number) => {
          // Timeline dot
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 1.35,
            y: 1.7 + idx * 1.1,
            w: 0.3,
            h: 0.3,
            fill: { color: theme.accent },
          });

          slide.addText(item, {
            x: 2.0,
            y: 1.7 + idx * 1.1,
            w: 7.2,
            h: 0.8,
            fontSize: 16,
            color: theme.text,
            fontFace: "Arial",
            valign: "top",
          });
        });
      }
      break;
  }
};

// Section slide with dynamic layouts
export const createSectionSlide = (
  slide: any,
  data: any,
  theme: any,
  index: number
) => {
  const layouts = ["bold", "diagonal", "gradient", "minimal"];
  const layout = layouts[index % layouts.length];

  switch (layout) {
    case "bold":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { color: theme.primary },
      });

      slide.addText(data.title, {
        x: 0.5,
        y: 3.0,
        w: 9.0,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Arial",
      });
      break;

    case "diagonal":
      // Diagonal split background
      slide.addShape(pptx.ShapeType.rect, {
        x: -2,
        y: 0,
        w: 8,
        h: 10,
        rotate: 15,
        fill: { color: theme.secondary },
      });

      slide.addText(data.title, {
        x: 1.0,
        y: 2.8,
        w: 8.0,
        h: 2.0,
        fontSize: 52,
        bold: true,
        color: theme.primary,
        align: "left",
        fontFace: "Arial",
        lineSpacing: 45,
      });
      break;

    case "gradient":
      // Simulated gradient with overlapping rectangles
      for (let i = 0; i < 10; i++) {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: i * 0.75,
          w: 10,
          h: 0.75,
          fill: {
            color: theme.primary,
            transparency: 10 + i * 7,
          },
        });
      }

      slide.addText(data.title, {
        x: 0.5,
        y: 2.8,
        w: 9.0,
        h: 2.0,
        fontSize: 50,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Arial",
        shadow: {
          type: "outer",
          blur: 8,
          offset: 3,
          angle: 45,
          color: "000000",
          opacity: 0.5,
        },
      });
      break;

    case "minimal":
      slide.addText(data.title, {
        x: 0.8,
        y: 3.2,
        w: 8.4,
        h: 1.2,
        fontSize: 46,
        bold: true,
        color: theme.primary,
        align: "left",
        fontFace: "Arial",
      });

      // Decorative line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 4.5,
        w: 3.5,
        h: 0.08,
        fill: { color: theme.accent },
      });
      break;
  }
};

// export default handleDownload;
