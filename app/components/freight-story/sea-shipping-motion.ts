import { SEA_PICKUP as M, seaPickupPose } from './sea-pickup-motion.ts';
import { rigClamp, rigMix, rigStep } from './rig-math.ts';

export const SEA_PORT = {
  quayEdge: 950, craneX: -650, craneY: -2050,
  craneWidth: 2700 * 1513 / 958, craneHeight: 2700,
  railY: -1000, trolleyWidth: 240, trolleyHeight: 240 * 541 / 1600,
  vesselX: 1000, vesselY: -436, vesselWidth: 4000, vesselHeight: 1256,
  waterlineCrop: 1078, deckY: 450, cargoDeckX: 1830,
} as const;
export const SEA_PHASE_BOUNDARIES = [.06, .24, .50, .63, .90] as const;

export function seaShippingPose(progress: number) {
  const p = rigClamp(progress), pickup = seaPickupPose(Math.min(1, p / .5));
  const transport = rigStep(p, .50, .63), leave = rigStep(p, .90, 1);
  const lift = rigStep(p, .665, .715), cross = rigStep(p, .715, .80), lower = rigStep(p, .80, .86);
  const shipOffset = 900 * leave;
  const truckX = pickup.truckX - 230 * transport - 1100 * leave;
  let cargoX = pickup.containerX - 230 * transport;
  let cargoY = pickup.containerY;
  if (p >= .665) {
    cargoX = rigMix(306, SEA_PORT.cargoDeckX, cross) + shipOffset;
    cargoY = rigMix(rigMix(M.trailerDeck - M.containerHeight, -740, lift), SEA_PORT.deckY - M.containerHeight, lower);
  }
  const hookReturn = rigStep(p, .90, 1);
  const trolleyX = rigMix(p < .665 ? cargoX + M.containerWidth / 2 : rigMix(306, SEA_PORT.cargoDeckX, cross) + M.containerWidth / 2, 480, hookReturn);
  const hookGap = 70 * (1 - rigStep(p, .63, .665)) + 210 * rigStep(p, .86, .90);
  const hookY = rigMix(cargoY - M.spreaderHeight - hookGap, -700, hookReturn);
  const zoom = rigMix(rigMix(1, .24, transport), .18, leave);
  // Camera rises with the load; the environment plate pans by the same offset,
  // keeping photographed pavement and vessel waterline aligned with rig anchors.
  const cameraPanY = 270 * lift * (1 - lower);
  return {
    progress: p, pickup, transport, portOpacity: rigStep(p, .50, .58),
    camera: { zoom, x: (587 - SEA_PORT.quayEdge * zoom) * transport, y: (380 - M.ground * zoom) * transport + cameraPanY },
    cameraPanY,
    stackerExit: 20000 * rigStep(p, .50, .59),
    truckX, truckWheelAngle: (truckX + 850) / 28 * 180 / Math.PI,
    containerX: cargoX, containerY: cargoY,
    vesselX: SEA_PORT.vesselX + shipOffset, vesselY: SEA_PORT.vesselY, shipOffset,
    trolleyX, hookX: trolleyX - M.containerWidth / 2, hookY,
    cableTop: SEA_PORT.railY, cableBottom: hookY + M.spreaderMountY,
    craneLocked: p >= .665 && p <= .86,
    supportedBy: p < .665 ? (pickup.supported ? 'truck' : 'stacker-or-ground') : p < .86 ? 'crane' : 'vessel',
  };
}
