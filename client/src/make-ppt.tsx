// ===============================
// 🎨 Themes & Layout Definitions
// ===============================

export const THEMES = [
  {
    name: "Ocean Blue",
    primary: "1E40AF",
    secondary: "3B82F6",
    accent: "60A5FA",
    background: "FFFFFF",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["1E40AF", "3B82F6"],
  },
  {
    name: "Sunset Glow",
    primary: "DC2626",
    secondary: "F59E0B",
    accent: "FBBF24",
    background: "FFFFFF",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["DC2626", "F59E0B"],
  },
  {
    name: "Forest Green",
    primary: "059669",
    secondary: "10B981",
    accent: "34D399",
    background: "FFFFFF",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["059669", "10B981"],
  },
  {
    name: "Purple Elegance",
    primary: "7C3AED",
    secondary: "A78BFA",
    accent: "C4B5FD",
    background: "FFFFFF",
    text: "1F2937",
    lightText: "6B7280",
    gradient: ["7C3AED", "A78BFA"],
  },
  {
    name: "Modern Dark",
    primary: "1F2937",
    secondary: "4B5563",
    accent: "3B82F6",
    background: "F9FAFB",
    text: "111827",
    lightText: "6B7280",
    gradient: ["1F2937", "4B5563"],
  },
];

export const LAYOUTS = {
  title: ["centered", "leftAligned", "splitScreen", "minimalist"],
  content: ["classic", "twoColumn", "featured", "timeline"],
  section: ["bold", "diagonal", "gradient", "minimal"],
};

// ===============================
// 🖼️ Title Slide Creator
// ===============================
export const createTitleSlide = (
  pptx: any,
  slide: any,
  data: any,
  theme: any,
  index: number
) => {
  const layouts = LAYOUTS.title;
  const layout = layouts[index % layouts.length];

  switch (layout) {
    case "centered":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { type: "gradient", color: theme.gradient },
      });
      // if (data.imageUrl) {
      //   slide.addImage({
      //     path: data.imageUrl,
      //     x: 0,
      //     y: 0,
      //     w: 10,
      //     h: 7.5,
      //     transparency: 15,
      //   });
      // }

      if (!slide.imageUrl || slide.imageUrl.includes("unsplash")) {
        // fallback color background
        slide.background = { fill: "203864" };
      } else {
        // safe image path (maybe local)
        slide.addImage({
          path: slide.imageUrl,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
        });
      }

      slide.addText(data.title, {
        x: 0.5,
        y: 2.4,
        w: 9,
        h: 2,
        fontSize: 54,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Poppins",
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 0.5,
          y: 4.2,
          w: 9,
          h: 1,
          fontSize: 26,
          color: "E5E7EB",
          align: "center",
          fontFace: "Inter",
        });
      }
      break;

    case "leftAligned":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { color: data.imageUrl ? "000000" : theme.background },
      });
      // if (data.imageUrl) {
      //   slide.addImage({ path: data.imageUrl, x: 0, y: 0, w: 10, h: 7.5 });
      // }

      if (!slide.imageUrl || slide.imageUrl.includes("unsplash")) {
        // fallback color background
        slide.background = { fill: "203864" };
      } else {
        // safe image path (maybe local)
        slide.addImage({
          path: slide.imageUrl,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
        });
      }

      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.2,
        h: 7.5,
        fill: { color: theme.primary },
      });

      slide.addText(data.title, {
        x: 1,
        y: 2.6,
        w: 8.5,
        h: 1.5,
        fontSize: 52,
        bold: true,
        color: data.imageUrl ? "FFFFFF" : theme.primary,
        align: "left",
        fontFace: "Poppins",
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1,
          y: 4.0,
          w: 8.5,
          h: 0.8,
          fontSize: 24,
          color: data.imageUrl ? "E5E7EB" : theme.secondary,
          fontFace: "Inter",
        });
      }
      break;

    case "splitScreen":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 5,
        h: 7.5,
        fill: { color: theme.primary },
      });

      // if (data.imageUrl) {
      //   slide.addImage({
      //     path: data.imageUrl,
      //     x: 0,
      //     y: 0,
      //     w: 5,
      //     h: 7.5,
      //   });
      // }

      if (!slide.imageUrl || slide.imageUrl.includes("unsplash")) {
        // fallback color background
        slide.background = { fill: "203864" };
      } else {
        // safe image path (maybe local)
        slide.addImage({
          path: slide.imageUrl,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
        });
      }

      slide.addText(data.title, {
        x: 5.3,
        y: 2.5,
        w: 4.4,
        h: 2,
        fontSize: 48,
        bold: true,
        color: theme.primary,
        fontFace: "Poppins",
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 5.3,
          y: 4.4,
          w: 4.4,
          h: 0.8,
          fontSize: 22,
          color: theme.lightText,
          fontFace: "Inter",
        });
      }
      break;

    case "minimalist":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { color: theme.background },
      });

      slide.addText(data.title, {
        x: 1.0,
        y: 3.0,
        w: 8,
        h: 1.5,
        fontSize: 56,
        bold: true,
        color: theme.text,
        align: "left",
        fontFace: "Poppins",
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: 4.4,
        w: 2.5,
        h: 0.08,
        fill: { color: theme.accent },
      });

      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.0,
          y: 4.6,
          w: 8.0,
          h: 0.8,
          fontSize: 22,
          color: theme.lightText,
          fontFace: "Inter",
        });
      }
      break;
  }
};

// ===============================
// 🧩 Content Slide Creator
// ===============================
export const createContentSlide = (
  pptx: any,
  slide: any,
  data: any,
  theme: any,
  index: number
) => {
  const layouts = LAYOUTS.content;
  const layout = layouts[index % layouts.length];

  switch (layout) {
    case "classic":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { color: theme.background },
      });

      slide.addText(data.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 36,
        bold: true,
        color: theme.primary,
        align: "center",
        fontFace: "Poppins",
      });

      if (data.content) {
        const bulletPoints = data.content.map((t: string) => ({
          text: t,
          options: { breakLine: true },
        }));

        slide.addText(bulletPoints, {
          x: 1,
          y: 1.6,
          w: 8.5,
          h: 5,
          fontSize: 20,
          color: theme.text,
          bullet: { code: "2022", color: theme.accent },
          fontFace: "Inter",
          lineSpacing: 30,
        });
      }
      break;

    case "twoColumn":
      slide.addText(data.title, {
        x: 0.5,
        y: 0.4,
        w: 9,
        h: 0.8,
        fontSize: 34,
        bold: true,
        color: theme.primary,
        align: "center",
        fontFace: "Poppins",
      });

      const midPoint = Math.ceil(data.content.length / 2);
      const left = data.content.slice(0, midPoint);
      const right = data.content.slice(midPoint);

      const bullets = (content: string[], x: number) =>
        slide.addText(
          content.map((t) => ({ text: t })),
          {
            x,
            y: 1.6,
            w: 4.2,
            h: 5,
            fontSize: 18,
            color: theme.text,
            bullet: { code: "2022", color: theme.accent },
            lineSpacing: 28,
            fontFace: "Inter",
          }
        );

      bullets(left, 0.6);
      bullets(right, 5.3);
      break;

    case "featured":
      slide.addText(data.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 38,
        bold: true,
        color: theme.primary,
        align: "center",
        fontFace: "Poppins",
      });

      data.content.forEach((item: string, idx: number) => {
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 0.8,
          y: 1.6 + idx * 0.9,
          w: 0.4,
          h: 0.4,
          fill: { color: theme.secondary },
        });

        slide.addText(`${idx + 1}`, {
          x: 0.8,
          y: 1.6 + idx * 0.9,
          w: 0.4,
          h: 0.4,
          fontSize: 16,
          bold: true,
          color: "FFFFFF",
          align: "center",
          valign: "middle",
          fontFace: "Poppins",
        });

        slide.addText(item, {
          x: 1.4,
          y: 1.7 + idx * 0.9,
          w: 7.8,
          h: 0.7,
          fontSize: 18,
          color: theme.text,
          fontFace: "Inter",
        });
      });
      break;

    case "timeline":
      slide.addText(data.title, {
        x: 0.5,
        y: 0.4,
        w: 9,
        h: 0.8,
        fontSize: 34,
        bold: true,
        color: theme.primary,
        align: "center",
        fontFace: "Poppins",
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 1.4,
        y: 1.5,
        w: 0.05,
        h: 5.2,
        fill: { color: theme.secondary },
      });

      data.content.forEach((item: string, idx: number) => {
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 1.3,
          y: 1.7 + idx * 1.1,
          w: 0.3,
          h: 0.3,
          fill: { color: theme.accent },
        });

        slide.addText(item, {
          x: 2.0,
          y: 1.7 + idx * 1.1,
          w: 7.0,
          h: 0.8,
          fontSize: 18,
          color: theme.text,
          fontFace: "Inter",
        });
      });
      break;
  }
};

// ===============================
// 📘 Section Slide Creator
// ===============================
export const createSectionSlide = (
  pptx: any,
  slide: any,
  data: any,
  theme: any,
  index: number
) => {
  const layouts = LAYOUTS.section;
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
        fontSize: 50,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Poppins",
      });
      break;

    case "diagonal":
      slide.addShape(pptx.ShapeType.triangle, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { type: "gradient", color: theme.gradient },
      });
      slide.addText(data.title, {
        x: 1,
        y: 3,
        w: 8,
        h: 2,
        fontSize: 52,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Poppins",
      });
      break;

    case "gradient":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { type: "gradient", color: theme.gradient },
      });
      slide.addText(data.title, {
        x: 1,
        y: 3,
        w: 8,
        h: 1.5,
        fontSize: 50,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Poppins",
      });
      break;

    case "minimal":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
        fill: { color: theme.background },
      });
      slide.addText(data.title, {
        x: 0.8,
        y: 3.2,
        w: 8.4,
        h: 1.2,
        fontSize: 46,
        bold: true,
        color: theme.primary,
        align: "left",
        fontFace: "Poppins",
      });
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
