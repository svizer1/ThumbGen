import type { ImageProvider, GenerationRequest, GenerationResponse } from './types';

/**
 * MockProvider — returns a seeded random image from Picsum Photos.
 * Used when IMAGE_PROVIDER=mock or when no real provider is configured.
 * No API key required. Simulates generation latency.
 */
export class MockProvider implements ImageProvider {
  name = 'mock';

  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const start = Date.now();

    // Simulate realistic generation time: 2-4 seconds
    const delay = 2000 + Math.random() * 2000;
    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    // Derive a deterministic-ish seed from the prompt so repeated
    // requests with the same prompt return the same image during a session
    const seed = Math.abs(
      request.prompt
        .split('')
        .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
    ) % 1000;

    const width = request.width ?? 1280;
    const height = request.height ?? 720;

    // Picsum gives real, varied, high-quality photographs
    const imageUrl = ` https://picsum.photos/seed/${seed}/${width}/${height} `;

    return {
      imageUrl,
      seed,
      model: 'mock-v1.0',
      timingMs: Date.now() - start,
    };
  }
}