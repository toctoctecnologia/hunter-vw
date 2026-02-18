// Stub for next/server - these APIs don't work in client-side Vite apps
export class NextResponse {
  static next() { return new Response(); }
  static redirect(url: string | URL) { 
    if (typeof window !== 'undefined') {
      window.location.href = typeof url === 'string' ? url : url.toString();
    }
    return new Response();
  }
  static json(data: any) { return new Response(JSON.stringify(data)); }
}

export class NextRequest extends Request {}
