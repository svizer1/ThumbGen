export interface GenerationRequest {
  prompt: string;
  negativePrompt?: string;
  referenceImageUrl?: string;
  sourceImageUrls?: string[];
  width?: number;
  height?: number;
  steps?: number;
  guidanceScale?: number;
  generationType?: 'text-to-image' | 'image-to-image';
  strength?: number; // Для image-to-image: насколько сильно изменять (0.0-1.0)
}

export interface GenerationResponse {
  imageUrl: string;
  seed?: number;
  model?: string;
  timingMs?: number;
}

export interface ImageProvider {
  name: string;
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}