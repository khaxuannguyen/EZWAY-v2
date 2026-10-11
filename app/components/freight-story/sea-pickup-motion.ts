// Coordinates are in one shared 1600 × 900 side-elevation camera space.
// The spreader lock datum, boom wrist and chassis contact are explicit anchors.
export const SEA_PICKUP = {
  width: 1600, height: 900, ground: 650,
  containerWidth: 347, containerHeight: 347 * 2.591 / 6.058,
  bodyWidth: 470, bodyHeight: 470 * 489 / 1200,
  bodyPivotX: 393, bodyPivotY: 49,
  spreaderHeight: 347 * 326 / 1200, spreaderMountY: 7,
  truckWidth: 760, truckHeight: 760 * 305 / 1200,
  trailerDeck: 571, boomTipOffsetY: 44.13,
} as const;

export const PICKUP_PHASES = [
  ['Tiến vào vị trí', 'Reach stacker tiếp cận container đang nằm tại bãi.'],
  ['Khóa spreader', 'Hạ spreader đến các góc container trước khi nâng.'],
  ['Nâng khỏi mặt đất', 'Cần nâng và container chuyển động cùng điểm gắn; bóng tách khỏi chân hàng.'],
  ['Đưa lên trailer', 'Xe vào vị trí; reach stacker tiến tới với container đã nâng.'],
  ['Hạ xuống chassis', 'Container hạ đến mặt chassis, giữ đúng vị trí tiếp xúc.'],
  ['Nhả khóa và thu cần', 'Container giữ trên trailer; spreader nhả và thiết bị thu cần.'],
] as const;

function step(p: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
  return t * t * (3 - 2 * t);
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function seaPickupPose(progress: number) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const approach = step(p, 0, .12), lock = step(p, .12, .24);
  const lift = step(p, .24, .48), traverse = step(p, .48, .68);
  const lower = step(p, .68, .86), release = step(p, .86, 1);
  const bodyX = 1030 - 100 * approach - 110 * traverse + 60 * release;
  const bodyY = SEA_PICKUP.ground - SEA_PICKUP.bodyHeight;
  const containerX = mix(620, 536, traverse);
  const groundTop = SEA_PICKUP.ground - SEA_PICKUP.containerHeight;
  const containerY = mix(mix(groundTop, 315, lift), SEA_PICKUP.trailerDeck - SEA_PICKUP.containerHeight, lower);
  const spreaderX = containerX + 140 * release;
  const spreaderY = containerY - SEA_PICKUP.spreaderHeight - 60 * (1 - lock) - 110 * release;
  const pivotX = bodyX + SEA_PICKUP.bodyPivotX, pivotY = bodyY + SEA_PICKUP.bodyPivotY;
  const wristX = spreaderX + SEA_PICKUP.containerWidth / 2;
  const wristY = spreaderY + SEA_PICKUP.spreaderMountY;
  const dx = wristX - pivotX, dy = wristY - pivotY;
  // A fixed outer section rotates at the chassis hinge. The inner photographed
  // section slides along its axis; neither the boom nor the cargo is scaled.
  const boomLength = Math.sqrt(dx * dx + dy * dy - SEA_PICKUP.boomTipOffsetY ** 2);
  const boomAngle = (Math.atan2(dy, dx) - Math.atan2(SEA_PICKUP.boomTipOffsetY, -boomLength)) * 180 / Math.PI;
  const truckX = mix(-850, 130, step(p, .38, .60));
  return {
    progress: p, bodyX, bodyY, pivotX, pivotY,
    containerX, containerY, spreaderX, spreaderY, wristX, wristY,
    boomLength, boomAngle, truckX,
    locked: p >= .24 && p <= .86,
    supported: p >= .86,
    wheelAngle: (bodyX - 1030) / 46 * 180 / Math.PI,
    truckWheelAngle: (truckX + 850) / 28 * 180 / Math.PI,
    shadowOpacity: mix(.32, .08, Math.min(1, (groundTop - containerY) / 194)),
    shadowScale: mix(1, .68, Math.min(1, (groundTop - containerY) / 194)),
  };
}
