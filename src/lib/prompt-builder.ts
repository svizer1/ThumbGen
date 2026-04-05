import { GenerationInput } from '@/types';
import { smartEnhancePrompt } from './prompt-enhancer';

export interface BuiltPrompt {
  mainPrompt: string;
  negativePrompt: string;
}

export function buildThumbnailPrompt(input: GenerationInput): BuiltPrompt {
  const parts: string[] = [];

  // ── Priority 1: Main subject (most important) ──────────────────────────────
  if (input.details.face.trim()) {
    parts.push(`(${input.details.face.trim()}:1.3)`);
  }

  // ── Priority 2: Emotion (critical for thumbnails) ──────────────────────────
  if (input.details.emotion.trim()) {
    parts.push(
      `(${input.details.emotion.toLowerCase()} expression:1.2), highly expressive, dramatic facial features`
    );
  }

  // ── Priority 3: Core description ───────────────────────────────────────────
  if (input.generalDescription.trim()) {
    parts.push(input.generalDescription.trim());
  }

  // ── Priority 4: Text overlay (very important for YouTube) ──────────────────
  if (input.details.thumbnailText.trim()) {
    parts.push(
      `(bold text overlay "${input.details.thumbnailText.trim()}":1.2), large impactful typography, white text with black outline and drop shadow, highly readable`
    );
  }

  // ── Priority 5: Objects / props ────────────────────────────────────────────
  if (input.details.objects.trim()) {
    parts.push(`featuring ${input.details.objects.trim()}`);
  }

  // ── Priority 6: Composition ────────────────────────────────────────────────
  if (input.details.composition.trim()) {
    parts.push(`(${input.details.composition.trim()}:1.1)`);
  } else {
    // Default composition for thumbnails
    parts.push('rule of thirds composition, subject prominently positioned');
  }

  // ── Priority 7: Background ─────────────────────────────────────────────────
  if (input.details.background.trim()) {
    parts.push(`background: ${input.details.background.trim()}`);
  }

  // ── Priority 8: Color palette ──────────────────────────────────────────────
  if (input.details.colors.trim()) {
    parts.push(`(color scheme: ${input.details.colors.trim()}:1.1), highly saturated, vibrant`);
  } else {
    parts.push('vibrant saturated colors, high color contrast');
  }

  // ── Priority 9: Style ──────────────────────────────────────────────────────
  if (input.details.style.trim()) {
    parts.push(`visual style: ${input.details.style.trim()}`);
  }

  // ── Priority 10: Extra details ─────────────────────────────────────────────
  if (input.details.extraDetails.trim()) {
    parts.push(input.details.extraDetails.trim());
  }

  // ── Reference hints ────────────────────────────────────────────────────────
  if (input.referenceImageUrl && input.referenceDescription) {
    parts.push(`(matching the visual style of: ${input.referenceDescription}:1.2), similar composition and aesthetic`);
  } else if (input.referenceImageUrl) {
    parts.push('matching the visual style and layout of the reference thumbnail');
  }

  if (input.sourceImageUrls.length > 0) {
    parts.push('incorporating visual elements from the provided source images');
  }

  // ── YouTube thumbnail essentials (always included) ─────────────────────────
  parts.push(
    'professional YouTube thumbnail',
    '(ultra high contrast:1.2)',
    'eye-catching clickbait aesthetic',
    'attention-grabbing composition',
    'studio-quality photography',
    '16:9 aspect ratio',
    '(pin-sharp focus:1.1)',
    'dramatic cinematic lighting with strong highlights',
    'strong visual hierarchy',
    'professional color grading and retouching',
    'optimized for small screen viewing'
  );

  let mainPrompt = parts.join(', ');
  
  // ── AI Enhancement & Optimization ──────────────────────────────────────────
  mainPrompt = smartEnhancePrompt(mainPrompt);

  // ── Negative prompt (expanded for better quality) ──────────────────────────
  const negativePrompt = [
    // Quality issues
    'blurry', 'out of focus', 'soft focus', 'low quality', 'low resolution',
    'pixelated', 'jpeg artifacts', 'compression artifacts', 'noise', 'grain',
    'underexposed', 'overexposed', 'washed out',
    
    // Visual issues
    'watermark', 'logo', 'signature', 'username',
    'text errors', 'typos', 'misspelled text', 'unreadable text',
    'cluttered', 'messy', 'chaotic', 'disorganized',
    
    // Anatomical issues
    'bad anatomy', 'distorted face', 'deformed', 'disfigured',
    'ugly', 'poorly drawn face', 'mutation', 'mutated',
    'extra limbs', 'missing limbs', 'floating limbs',
    
    // Style issues
    'dull colors', 'muted colors', 'desaturated',
    'flat lighting', 'boring composition', 'amateur',
    'unprofessional', 'low effort', 'generic',
    
    // Unwanted elements
    'duplicate', 'cropped', 'cut off', 'draft', 'unfinished'
  ].join(', ');

  return { mainPrompt, negativePrompt };
}