import type { FrameSequence } from './frame-sequence';
import type { FreightMode } from './story-config';

export interface FreightVisual {
  poster: { desktop: string; mobile: string; width: number; height: number; alt: string };
  sequence?: FrameSequence;
  status: 'poster-only' | 'sequence-approved';
}

// Still posters are deliberately not advertised as mechanical animation.
// Only attach a sequence after the production asset gate in docs/freight-story-production.md.
export const FREIGHT_VISUALS: Record<FreightMode, FreightVisual> = {
  sea: { status: 'poster-only', poster: {
    desktop: '/assets/freight-story/sea/posters/terminal-1672.webp',
    mobile: '/assets/freight-story/sea/posters/terminal-960.webp',
    width: 1672, height: 941,
    alt: 'Minh hoạ photorealistic bãi container, reach stacker và đầu kéo tại cảng; hình tạo bằng AI, không phải đội phương tiện EZWAY.',
  } },
  air: { status: 'poster-only', poster: {
    desktop: '/assets/freight-story/air/posters/apron-1672.webp',
    mobile: '/assets/freight-story/air/posters/apron-960.webp',
    width: 1672, height: 941,
    alt: 'Minh hoạ photorealistic máy bay hàng hóa và high loader trên sân đỗ; hình tạo bằng AI, không phải đội phương tiện EZWAY.',
  } },
};
