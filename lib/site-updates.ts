export function shouldNotifyVersion(baseline:string,current:string,pathname:string,dismissed=''){return pathname!=='/admin'&&!pathname.startsWith('/admin/')&&!!current&&current!==baseline&&current!==dismissed}
export function navigationNeedsCollapse(viewport:number,available:number,required:number){return viewport<=900||required>available}
