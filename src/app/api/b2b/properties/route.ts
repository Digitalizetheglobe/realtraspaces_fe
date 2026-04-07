import { NextResponse } from 'next/server';

const B2B_API_URL = 'https://connector.b2bbricks.com/api/Property/getrecentproperties';
const B2B_TOKEN =
  process.env.B2B_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJhaHVsc29uYXJAY3JlZGVmaW5lLmNvbSIsIm5iZiI6MTc3NTEyMTM0MSwiZXhwIjoxOTMyODg3NzQxLCJpYXQiOjE3NzUxMjEzNDEsImlzcyI6Imh0dHBzOi8vY29ubmVjdG9yLmIyYmJyaWNrcy5jb20iLCJhdWQiOiJodHRwczovL2Nvbm5lY3Rvci5iMmJicmlja3MuY29tIn0.sgFhfl2X3DhaDckUkVqLQ1pAkSsRFUuRJT8eTwekVZs';

export async function GET() {
  try {
    const upstream = await fetch(B2B_API_URL, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${B2B_TOKEN}`,
      },
    });

    const contentType = upstream.headers.get('content-type') || 'application/json';
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

