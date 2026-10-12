declare module 'cloudflare:workers' { export const env: Record<string,unknown>; }
declare module 'vinext/server/app-router-entry' {
  const handler: {fetch(request:Request,env:Record<string,unknown>,ctx:ExecutionContext):Promise<Response>};
  export default handler;
}
