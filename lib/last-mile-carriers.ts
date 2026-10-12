// Public, fixed official destinations. Never adopt an upstream-provided URL.
const names = ['UPS','DHL','DHL Express','DHL eCommerce','DPD','FedEx','USPS','Canada Post','Royal Mail','Australia Post'] as const;
export type LastMileCarrier = typeof names[number];
export function verifiedCarrier(value?: string): LastMileCarrier | undefined {
  const key=value?.trim().toLowerCase().replace(/\s+/g,' ');
  return names.find(name=>name.toLowerCase()===key);
}
const fixedUrls: Partial<Record<LastMileCarrier,string>> = {
  UPS:'https://www.ups.com/track',
  DHL:'https://www.dhl.com/', 'DHL Express':'https://www.dhl.com/', 'DHL eCommerce':'https://www.dhl.com/',
  FedEx:'https://www.fedex.com/vi-vn/tracking.html',
};
export function lastMileUrl(carrier:LastMileCarrier,country?:string) {
  if(carrier==='DPD') return /^(UK|GB|United Kingdom|Great Britain|Anh)$/i.test(country?.trim()??'') ? 'https://track.dpd.co.uk/search' : undefined;
  return fixedUrls[carrier]; // Name-only for markets/endpoints not yet verified.
}
export function isVerifiedLastMileUrl(carrier:string|undefined,value:string|undefined): value is string {
  const name=verifiedCarrier(carrier);if(!name||!value)return false;
  try {
    const url=new URL(value);
    const expected=lastMileUrl(name,name==='DPD'?'GB':undefined);
    if(!expected)return false;const allowed=new URL(expected);
    return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&url.hostname===allowed.hostname&&url.pathname===allowed.pathname&&!url.search&&!url.hash;
  }catch{return false;}
}
