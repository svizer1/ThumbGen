export type GenerationMode = 'prompt' | 'api';

export interface DetailedFields {
  face: string;
  emotion: string;
  objects: string;
  background: string;
  colors: string;
  thumbnailText: string;
  composition: string;
  style: string;
  extraDetails: string;
}

export interface GenerationInput {
  generalDescription: string;
  details: DetailedFields;
  mode: GenerationMode;
  sourceImageUrls: string[];
  referenceImageUrl?: string;
  referenceDescription?: string;
  characterImageUrl?: string;
  imageSize?: string;
  generationType?: 'text-to-image' | 'image-to-image';
  apiProvider?: 'default' | 'puter' | 'bytez' | 'huggingface';
  bytezModel?: string;
  huggingfaceModel?: string;
}

export interface GenerationResult {
  generatedPrompt: string;
  negativePrompt: string;
  generatedImageUrl?: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  mode: GenerationMode;
  input: GenerationInput;
  result: GenerationResult;
  status: 'success' | 'error';
  error?: string;
}

export interface GenerateApiResponse {
  id: string;
  generatedPrompt: string;
  negativePrompt: string;
  generatedImageUrl?: string;
  status: 'success' | 'error';
  error?: string;
}

export interface UploadApiResponse {
  urls: string[];
}