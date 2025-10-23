import { NextRequest, NextResponse } from 'next/server';

const RAWGLE_API_BASE = 'https://rawgle.com/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get the endpoint (nearby, search, etc.)
  const endpoint = searchParams.get('endpoint') || 'nearby';
  searchParams.delete('endpoint');

  // Build the Rawgle API URL
  const rawgleUrl = `${RAWGLE_API_BASE}/${endpoint}?${searchParams.toString()}`;

  console.log('[Rawgle Proxy] Forwarding request to:', rawgleUrl);

  try {
    const response = await fetch(rawgleUrl);

    if (!response.ok) {
      console.error('[Rawgle Proxy] API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch from Rawgle API', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Rawgle Proxy] Success, suppliers count:', data.suppliers?.length || data.results?.length || 0);

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    console.error('[Rawgle Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers', message: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
