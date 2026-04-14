export type GenerationMode = 'prompt' | 'api' | 'wildberries' | 'playerok';

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
  details?: DetailedFields;
  mode: GenerationMode;
  productName?: string;
  category?: string;
  style?: string;
  topText?: string;
  middleText?: string;
  bottomText?: string;
  accentText?: string;
  sourceImageUrls?: string[];
  referenceImageUrl?: string;
  referenceDescription?: string;
  characterImageUrl?: string;
  imageSize?: string;
  generationType?: 'text-to-image' | 'image-to-image';
  apiProvider?: 'default' | 'puter' | 'bytez' | 'huggingface' | 'google-ai';
  bytezModel?: string;
  huggingfaceModel?: string;
  googleAIModel?: string;
  product?: any;
  options?: any;
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
  result: Partial<GenerationResult>;
  playerokCard?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    category: string;
    status: string;
    priceRub: number;
  };
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
