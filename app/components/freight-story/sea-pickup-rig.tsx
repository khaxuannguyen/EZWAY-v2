'use client';

import { useEffect, useRef, useState } from 'react';
import { SEA_PICKUP as M, seaPickupPose } from './sea-pickup-motion';
import { SEA_PORT as P, seaShippingPose } from './sea-shipping-motion';

const asset = (name: string) => `/assets/freight-story/sea/rig-v1/${name}.webp`;
const portAsset = (name: string) => `/assets/freight-story/sea/port-v1/${name}.webp`;
const at = (x: number, y: number, width: number, height: number) => ({ left: x, top: y, width, height });
const start = seaPickupPose(0);

export function SeaPickupRig() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '900px' });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !nearby || failed) return;
    const stage = root.closest<HTMLElement>('.freight-story-stage')!;
    const plane = root.querySelector<HTMLElement>('.sea-rig-plane')!;
    let disposed = false;
    const parts = Object.fromEntries([...root.querySelectorAll<HTMLElement>('[data-rig-part]')].map(node => [node.dataset.rigPart!, node]));
    const move = (name: string, x: number, y: number) => { parts[name].style.transform = `translate3d(${x}px,${y}px,0)`; };
    const draw = (p: number) => {
      const full = seaShippingPose(p), s = full.pickup, exit = full.stackerExit;
      move('body', s.bodyX + exit, s.bodyY);
      move('container', full.containerX, full.containerY);
      move('spreader', s.spreaderX + exit, s.spreaderY);
      move('truck', full.truckX, M.ground - M.truckHeight);
      parts.boom.style.transform = `translate3d(${s.pivotX + exit}px,${s.pivotY}px,0) rotate(${s.boomAngle}deg)`;
      parts.inner.style.transform = `translateX(${660.9 - s.boomLength}px)`;
      parts.shadow.style.transform = `translate3d(${full.containerX}px,${M.ground - 8}px,0) scaleX(${s.shadowScale})`;
      parts.shadow.style.opacity = String(full.cargoShadowOpacity);
      parts['body-shadow'].style.transform = `translate3d(${s.bodyX + exit}px,${M.ground - 9}px,0)`;
      parts['truck-shadow'].style.transform = `translate3d(${full.truckX}px,${M.ground - 8}px,0)`;
      parts.camera.style.transform = `translate3d(${full.camera.x}px,${full.camera.y}px,0) scale(${full.camera.zoom})`;
      parts['port-background'].style.opacity = String(full.portOpacity);
      parts['port-background'].style.transform = `translateY(${full.cameraPanY}px)`;
      parts.port.style.opacity = String(full.portOpacity);
      move('vessel', full.vesselX, full.vesselY);
      move('trolley', full.trolleyX - P.trolleyWidth / 2, P.railY - P.trolleyHeight);
      move('port-spreader', full.hookX, full.hookY);
      for (const name of ['cable-left', 'cable-right']) {
        move(name, full.trolleyX + (name === 'cable-left' ? -25 : 25), full.cableTop);
        parts[name].style.height = `${Math.max(0, full.cableBottom - full.cableTop)}px`;
      }
      root.querySelectorAll<HTMLElement>('.sea-body-wheel').forEach(wheel => { wheel.style.transform = `rotate(${s.wheelAngle}deg)`; });
      root.querySelectorAll<HTMLElement>('.sea-truck-wheel').forEach(wheel => { wheel.style.transform = `rotate(${full.truckWheelAngle}deg)`; });
      root.dataset.pose = JSON.stringify(full);
      root.closest<HTMLElement>('.freight-story')!.dataset.port = String(p >= .5);
      root.dataset.locked = String(s.locked || full.craneLocked);
      root.dataset.supported = String(full.supportedBy === 'truck' || full.supportedBy === 'vessel');
    };
    const resize = () => {
      const scale = Math.max(root.clientWidth / M.width, root.clientHeight / M.height);
      plane.style.left = `${(root.clientWidth - M.width * scale) / 2}px`;
      plane.style.top = `${(root.clientHeight - M.height * scale) / 2}px`;
      plane.style.transform = `scale(${scale})`;
    };
    const observer = new ResizeObserver(resize); observer.observe(root); resize();
    draw(Number(stage.dataset.progress || 0));
    const onProgress = (event: Event) => draw((event as CustomEvent<number>).detail);
    stage.addEventListener('freight-progress', onProgress);
    // Start the pinned motion only once every independent part is decoded.
    Promise.all([...root.querySelectorAll<HTMLImageElement>('img')].map(img => img.decode())).then(() => {
      if (disposed) return;
      root.dataset.ready = 'true'; stage.dataset.rigReady = 'true';
      stage.dispatchEvent(new Event('freight-rig-ready'));
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; observer.disconnect(); stage.removeEventListener('freight-progress', onProgress); delete stage.dataset.rigReady; };
  }, [nearby,failed]);
  if (failed) return <div className="sea-rig-error">Hình thao tác hiện chưa tải được. Xem quy trình và liên hệ EZWAY bên dưới.</div>;
  const source = (name: string) => nearby ? asset(name) : undefined;
  const portSource = (name: string) => nearby ? portAsset(name) : undefined;
  return <div ref={rootRef} className="sea-pickup-rig" data-ready="false" role="img" aria-label="Mô phỏng nâng container lên xe, cẩu chuyển lên tàu và tàu rời bến, điều khiển bằng cuộn trang">
    <div className="sea-rig-plane">
      <img className="sea-rig-background" src={source('background')} width="1600" height="900" alt="" loading="eager" decoding="async"/>
      <img data-rig-part="port-background" className="sea-rig-background" src={portSource('environment')} width="1600" height="900" alt="" loading="eager" decoding="async" style={{opacity:0}}/>
      <div data-rig-part="camera" className="sea-world">
      <div data-rig-part="port" className="sea-port" style={{opacity:0}}>
        <img className="sea-rig-object" src={portSource('crane')} style={at(P.craneX,P.craneY,P.craneWidth,P.craneHeight)} alt="" loading="eager" decoding="async"/>
        <div data-rig-part="vessel" className="sea-vessel" style={at(0,0,P.vesselWidth,P.waterlineCrop)}><img src={portSource('vessel')} style={{width:P.vesselWidth,height:P.vesselHeight,maxWidth:'none'}} alt="" loading="eager" decoding="async"/></div>
        <img data-rig-part="trolley" className="sea-rig-object" src={portSource('trolley')} style={at(0,0,P.trolleyWidth,P.trolleyHeight)} alt="" loading="eager" decoding="async"/>
        <i data-rig-part="cable-left" className="sea-port-cable"/><i data-rig-part="cable-right" className="sea-port-cable"/>
        <img data-rig-part="port-spreader" className="sea-rig-object" src={source('spreader')} style={at(0,0,M.containerWidth,M.spreaderHeight)} alt="" loading="eager" decoding="async"/>
      </div>
      <div data-rig-part="shadow" className="sea-rig-shadow" style={at(0, 0, M.containerWidth, 18)}/>
      <div data-rig-part="body-shadow" className="sea-rig-shadow sea-equipment-shadow" style={at(0, 0, M.bodyWidth, 20)}/>
      <div data-rig-part="truck-shadow" className="sea-rig-shadow sea-equipment-shadow" style={at(0, 0, M.truckWidth, 16)}/>
      <div data-rig-part="boom" className="sea-rig-boom" style={{ transform: `translate(${start.pivotX}px,${start.pivotY}px) rotate(${start.boomAngle}deg)` }}>
        <img data-rig-part="inner" className="sea-boom-inner" src={source('boom')} width="1200" height="203" alt="" loading="eager" decoding="async"/>
        <img className="sea-boom-outer" src={source('boom')} width="1200" height="203" alt="" loading="eager" decoding="async"/>
      </div>
      <div data-rig-part="body" className="sea-rig-object" style={at(0, 0, M.bodyWidth, M.bodyHeight)}>
        <img src={source('body')} width="1200" height="489" alt="" loading="eager" decoding="async"/>
        {[[49.35,146.48],[418.3,148.44]].map(([x,y]) => <i key={x} className="sea-rig-wheel sea-body-wheel" style={{ ...at(x - 40, y - 40, 80, 80), backgroundImage: nearby ? `url(${asset('body')})` : undefined, backgroundSize: `${M.bodyWidth}px ${M.bodyHeight}px`, backgroundPosition: `${-(x - 40)}px ${-(y - 40)}px` }}/>) }
      </div>
      <div data-rig-part="truck" className="sea-rig-object" style={at(0, 0, M.truckWidth, M.truckHeight)}>
        <img src={source('truck')} width="1200" height="305" alt="" loading="eager" decoding="async"/>
        {[[61.43,165.3],[264.73,165.3],[323,165.3],[638.4,164.03],[704.27,164.67]].map(([x,y]) => <i key={x} className="sea-rig-wheel sea-truck-wheel" style={{ ...at(x - 23, y - 23, 46, 46), backgroundImage: nearby ? `url(${asset('truck')})` : undefined, backgroundSize: `${M.truckWidth}px ${M.truckHeight}px`, backgroundPosition: `${-(x - 23)}px ${-(y - 23)}px` }}/>) }
      </div>
      <img data-rig-part="container" className="sea-rig-object" src={source('container')} style={at(0, 0, M.containerWidth, M.containerHeight)} width="1200" height="432" alt="" loading="eager" decoding="async"/>
      <img data-rig-part="spreader" className="sea-rig-object" src={source('spreader')} style={at(0, 0, M.containerWidth, M.spreaderHeight)} width="1200" height="326" alt="" loading="eager" decoding="async"/>
      </div>
    </div>
  </div>;
}
