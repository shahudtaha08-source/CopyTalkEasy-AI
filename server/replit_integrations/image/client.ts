import fs from "node:fs";
import { Buffer } from "node:buffer";

export const openai = null;

/**
 * Generate an image and return as Buffer.
 * Uses gpt-image-1 model via Replit AI Integrations.
 */
export async function generateImageBuffer(
  _prompt: string,
  _size: "1024x1024" | "512x512" | "256x256" = "1024x1024"
): Promise<Buffer> {
  throw new Error("AI image generation is disabled in this release.");
}

/**
 * Edit/combine multiple images into a composite.
 * Uses gpt-image-1 model via Replit AI Integrations.
 */
export async function editImages(
  _imageFiles: string[],
  _prompt: string,
  outputPath?: string
): Promise<Buffer> {
  if (outputPath) {
    fs.writeFileSync(outputPath, Buffer.alloc(0));
  }
  throw new Error("AI image generation is disabled in this release.");
}

