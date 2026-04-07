import { NextRequest, NextResponse } from 'next/server';

const B2B_API_BASE_URL = 'https://connector.b2bbricks.com/api';
// Prefer env var so tokens can be rotated without committing code.
// Keep a fallback for local dev if env var is not set.
const B2B_BEARER_TOKEN =
  process.env.B2B_BEARER_TOKEN ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJhaHVsc29uYXJAY3JlZGVmaW5lLmNvbSIsIm5iZiI6MTc3NTEyMTM0MSwiZXhwIjoxOTMyODg3NzQxLCJpYXQiOjE3NzUxMjEzNDEsImlzcyI6Imh0dHBzOi8vY29ubmVjdG9yLmIyYmJyaWNrcy5jb20iLCJhdWQiOiJodHRwczovL2Nvbm5lY3Rvci5iMmJicmlja3MuY29tIn0.sgFhfl2X3DhaDckUkVqLQ1pAkSsRFUuRJT8eTwekVZs';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const summarize = (value: unknown): { type: string; keys?: string[] } => {
  if (Array.isArray(value)) return { type: 'array', keys: ['[0..n]'] };
  if (!isRecord(value)) return { type: typeof value };
  return { type: 'object', keys: Object.keys(value).slice(0, 30) };
};

// Next.js 15: params is a Promise — must be awaited
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params (required in Next.js 15)
    const { path } = await params;

    // Reconstruct the B2B endpoint path
    const b2bPath = path.join('/');

    // Forward the query string as-is
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${B2B_API_BASE_URL}/${b2bPath}${searchParams ? `?${searchParams}` : ''}`;

    console.log('[B2B Proxy] →', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${B2B_BEARER_TOKEN}`,
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails: unknown = errorText;
      if (contentType.includes('application/json')) {
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          // Keep raw string
        }
      }

      console.error('[B2B Proxy] Error from B2B:', {
        status: response.status,
        url,
        contentType,
        contentLength: response.headers.get('content-length'),
        requestId:
          response.headers.get('x-request-id') ||
          response.headers.get('x-correlation-id') ||
          response.headers.get('request-id') ||
          response.headers.get('x-trace-id') ||
          response.headers.get('traceparent'),
        errorBodyLength: errorText?.length ?? 0,
        detailsSummary: summarize(errorDetails),
      });

      return NextResponse.json(
        {
          error: `B2B API error: ${response.status}`,
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    if (contentType.includes('application/json')) {
      const data = await response.json();
      console.log('[B2B Proxy] <- JSON response:', response.status, summarize(data));
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: { 'Content-Type': contentType },
      });
    }
  } catch (error) {
    console.error('[B2B Proxy] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to B2B Bricks API', details: String(error) },
      { status: 500 }
    );
  }
}
