import type { ImageProvider } from './types';
import { MockProvider } from './mock';

export { BytezProvider, BYTEZ_MODELS } from './bytez';
export { HuggingFaceProvider, HUGGINGFACE_MODELS } from './huggingface';
export { PuterProvider, PUTER_MODELS, PUTER_QUALITY_OPTIONS } from './puter';

export function getProvider(): ImageProvider {
  const providerName = (process.env.IMAGE_PROVIDER ?? 'mock').toLowerCase();

  switch (providerName) {
    case 'mock':
    default:
      return new MockProvider();
  }
}