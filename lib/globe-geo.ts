export type Vec3 = [number,number,number];
export const globeOrigin={lat:10.8231,lon:106.6297};
export const globeDestinations=[
 {code:'US',name:'Mỹ',city:'Los Angeles',lat:34.0522,lon:-118.2437},
 {code:'CA',name:'Canada',city:'Toronto',lat:43.6532,lon:-79.3832},
 {code:'AU',name:'Úc',city:'Sydney',lat:-33.8688,lon:151.2093},
 {code:'NZ',name:'New Zealand',city:'Auckland',lat:-36.8485,lon:174.7633},
 {code:'GB',name:'Anh',city:'London',lat:51.5074,lon:-.1278},
 {code:'EU',name:'Châu Âu',city:'Brussels',lat:50.8503,lon:4.3517},
] as const;
// Matches Three SphereGeometry's equirectangular UV seam at longitude -180°.
export function geoToCartesian(lat:number,lon:number,radius=1):Vec3 {const a=lat*Math.PI/180,b=lon*Math.PI/180;return [radius*Math.cos(a)*Math.cos(b),radius*Math.sin(a),-radius*Math.cos(a)*Math.sin(b)];}
export function greatCirclePoint(start:Vec3,end:Vec3,t:number,lift=.24):Vec3{
 const p=Math.max(0,Math.min(1,t)),dot=Math.max(-1,Math.min(1,start.reduce((s,v,i)=>s+v*end[i],0))),angle=Math.acos(dot);
 if(angle<1e-7)return [...start];
 const sin=Math.sin(angle);if(Math.abs(sin)<1e-7)throw new Error('Antipodal route requires a chosen bearing');
 const a=Math.sin((1-p)*angle)/sin,b=Math.sin(p*angle)/sin,r=1+lift*Math.sin(Math.PI*p);
 return start.map((v,i)=>(v*a+end[i]*b)*r) as Vec3;
}
export function routeLift(start:Vec3,end:Vec3){return .1+.2*Math.acos(Math.max(-1,Math.min(1,start.reduce((s,v,i)=>s+v*end[i],0))))/Math.PI;}
export function routeViewDirection(end:Vec3):Vec3{const start=geoToCartesian(globeOrigin.lat,globeOrigin.lon);const sum=start.map((v,i)=>v+end[i]);const length=Math.hypot(...sum);const normal=[start[1]*end[2]-start[2]*end[1],start[2]*end[0]-start[0]*end[2],start[0]*end[1]-start[1]*end[0]],normalLength=Math.hypot(...normal);const view=sum.map((v,i)=>v/length+(normalLength?normal[i]/normalLength*.24:0));const scale=Math.hypot(...view);return view.map(v=>v/scale) as Vec3;}
