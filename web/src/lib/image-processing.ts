import sharp from "sharp";

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<Buffer> {
  const {
    width,
    height,
    quality = 85,
    format = "webp",
    fit = "cover",
  } = options;

  let pipeline = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  // Set format and quality
  switch (format) {
    case "jpeg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality: Math.round(quality / 10) });
      break;
    case "webp":
    default:
      pipeline = pipeline.webp({ quality });
      break;
  }

  return pipeline.toBuffer();
}

export async function generateImageVariants(
  buffer: Buffer,
  filename: string
): Promise<Record<string, Buffer>> {
  const variants: Record<string, Buffer> = {};

  // Generate different size variants
  const sizes = [
    { name: "thumbnail", width: 150, height: 150 },
    { name: "preview", width: 400, height: 300 },
    { name: "card", width: 600, height: 400 },
    { name: "featured", width: 1200, height: 630 },
    { name: "hero", width: 1920, height: 1080 },
  ];

  for (const size of sizes) {
    try {
      variants[size.name] = await processImage(buffer, {
        width: size.width,
        height: size.height,
        quality: 85,
        format: "webp",
      });
    } catch (error) {
      console.error(
        `Error generating ${size.name} variant for ${filename}:`,
        error
      );
    }
  }

  return variants;
}

export function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}

export function optimizeImageForWeb(buffer: Buffer, maxWidth = 1920) {
  return sharp(buffer)
    .resize(maxWidth, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 85 })
    .toBuffer();
}
