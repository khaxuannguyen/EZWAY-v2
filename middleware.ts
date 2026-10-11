import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {isProtectedPath,securityHeaders} from './lib/public-security';
export function middleware(request:NextRequest){
  const response=isProtectedPath(request.nextUrl.pathname)?new NextResponse('Not found',{status:404}):NextResponse.next();
  for(const [key,value] of Object.entries(securityHeaders))response.headers.set(key,value);
  if(process.env.NODE_ENV==='production'&&request.nextUrl.protocol==='https:')response.headers.set('Strict-Transport-Security','max-age=31536000');
  if(request.nextUrl.pathname.startsWith('/api/')||request.nextUrl.pathname==='/tra-cuu'){
    response.headers.set('Cache-Control','private, no-store');response.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
  }
  return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
