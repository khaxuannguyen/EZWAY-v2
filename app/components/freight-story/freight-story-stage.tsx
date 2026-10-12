'use client';

import { lazy, Suspense, useState, Component, type ReactNode } from 'react';
import { FREIGHT_VISUALS } from './freight-assets';
import type { FreightMode } from './story-config';
import { SeaPickupRig } from './sea-pickup-rig';
import { AirFreightRig } from './air-freight-rig';

const Sequence = lazy(() => import('./frame-sequence-canvas').then(module => ({ default: module.FrameSequenceCanvas })));
class SequenceBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function FreightStoryStage({ mode, title, description }: { mode: FreightMode; title: string; description: string }) {
  const visual = FREIGHT_VISUALS[mode];
  const [failed, setFailed] = useState(false);
  return <div className="freight-story-stage" data-frames="false">
    {mode === 'sea' ? <SeaPickupRig/> : visual.status === 'air-rig' ? <AirFreightRig/> : !failed && <picture className="freight-poster"><source media="(max-width:767px)" srcSet={visual.poster.mobile}/><img src={visual.poster.desktop} width={visual.poster.width} height={visual.poster.height} alt={visual.poster.alt} loading="lazy" decoding="async" onError={() => setFailed(true)}/></picture>}
    {failed && <div className="freight-image-fallback"><p>EZWAY / {mode.toUpperCase()} FREIGHT</p><p>Hình minh hoạ hiện chưa tải được. Bạn vẫn có thể xem quy trình và nhận tư vấn bên dưới.</p></div>}
    {visual.sequence?.approved && <SequenceBoundary><Suspense fallback={null}><Sequence sequence={visual.sequence}/></Suspense></SequenceBoundary>}
    <div className="freight-stage-shade"/>
    <div className="freight-stage-copy"><p className="freight-phase-count">01 / 06</p><h3 className="freight-phase-caption">{title}</h3><p className="freight-phase-description">{description}</p></div>
    <span className="freight-stage-disclosure">HÌNH MINH HOẠ AI</span>
  </div>;
}
