import { rigClamp, rigMix, rigStep } from './rig-math.ts';

export const AIR_RIG = {
  width:1600,height:900,ground:650,
  aircraftWidth:4000,aircraftHeight:1110,aircraftY:-600,
  doorX:3212,doorY:30,doorWidth:300,doorHeight:248,doorFloor:278,
  loaderWidth:620,loaderHeight:620*337/1200,
  platformOffset:112,platformWidth:340,platformHeight:340*124/1200,
  // The photographed chassis top rail is at world y=555. The earlier y=520
  // anchor left both lower scissor bearings suspended above the frame.
  basePivotY:555,armLength:330,armHeight:330*95/1106,armArtworkWidth:330*1200/1106,armArtworkLeft:-330*47/1106,
  palletWidth:235,palletHeight:235*606/1200,
  mainGearX:1834,mainGearHeight:290,mainGearWidth:290*1092/1093,
  mainWheelRadius:290*244/1093,
  mainPivotX:1834+290*244/1093,mainPivotY:650-290*244/1093,
  noseGearX:3540,noseGearHeight:270,noseGearWidth:270*663/1481,
  noseWheelX:3540+270*334/1481,noseWheelY:650-270*245/1481,noseWheelRadius:270*245/1481,
} as const;
export const AIR_PHASE_BOUNDARIES=[.08,.20,.44,.65,.84] as const;

export function airFreightPose(progress:number){
  const p=rigClamp(progress),approach=rigStep(p,.08,.20),lift=rigStep(p,.20,.30),insert=rigStep(p,.30,.42),withdraw=rigStep(p,.49,.58);
  const loaderX=4100-700*approach+20000*withdraw;
  const platformX=loaderX+AIR_RIG.platformOffset;
  const platformY=rigMix(rigMix(460,AIR_RIG.doorFloor,lift),460,rigStep(p,.43,.49));
  const armTopY=platformY+AIR_RIG.platformHeight,armHeight=AIR_RIG.basePivotY-armTopY;
  const armSpan=Math.sqrt(AIR_RIG.armLength**2-armHeight**2);
  const armLeftX=platformX+(AIR_RIG.platformWidth-armSpan)/2;
  const armAngle=Math.atan2(armHeight,armSpan)*180/Math.PI;
  const palletX=rigMix(3512+50+(4100-700*approach-3400),2970,insert);
  const palletY=(p>=.42?AIR_RIG.doorFloor:platformY)-AIR_RIG.palletHeight;
  const accel=rigClamp((p-.65)/.19);
  const planeX=160*rigStep(p,.62,.65)+1200*accel**2+1800*rigStep(p,.84,1);
  const planeY=-1000*rigStep(p,.825,1);
  const pitch=-10*rigStep(p,.755,.82)-2*rigStep(p,.84,1);
  const radians=pitch*Math.PI/180;
  const noseX=AIR_RIG.mainPivotX+(AIR_RIG.noseWheelX-AIR_RIG.mainPivotX)*Math.cos(radians)-(AIR_RIG.noseWheelY-AIR_RIG.mainPivotY)*Math.sin(radians)+planeX;
  const noseY=AIR_RIG.mainPivotY+(AIR_RIG.noseWheelX-AIR_RIG.mainPivotX)*Math.sin(radians)+(AIR_RIG.noseWheelY-AIR_RIG.mainPivotY)*Math.cos(radians)+planeY;
  const zoom=rigMix(rigMix(.30,.55,rigStep(p,.12,.24)),.30,rigStep(p,.44,.60))-.03*rigStep(p,.84,1);
  const close=rigStep(p,.58,.62);
  return {
    progress:p,loaderX,platformX,platformY,armLeftX,armTopY,armSpan,armAngle,
    palletX,palletY,palletLoaded:p>=.42,
    doorAngle:105*(1-close),doorClosed:p>=.62,
    planeX,planeY,pitch,noseWheel:{x:noseX,y:noseY},mainContactY:AIR_RIG.ground+planeY,
    gearAngle:90*rigStep(p,.875,.965),
    wheelAngle:planeX/AIR_RIG.mainWheelRadius*180/Math.PI,
    noseWheelAngle:planeX/AIR_RIG.noseWheelRadius*180/Math.PI,
    loaderWheelAngle:(loaderX-4100)/34*180/Math.PI,
    skyOpacity:rigStep(p,.84,.98),backgroundX:-200*rigStep(p,.65,.84),
    camera:{zoom,x:rigMix(80,900-3362*.55,rigStep(p,.12,.24))*(1-rigStep(p,.44,.60))+80*rigStep(p,.44,.60)-planeX*zoom,y:650-AIR_RIG.ground*zoom-planeY*zoom*.7},
  };
}
