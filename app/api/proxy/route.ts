// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  const target = req.nextUrl.searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  // Compose full proxy URL
  const proxyUrl = `https://thingproxy.freeboard.io/fetch/${target}`;

  try {
    const response = await axios.get(proxyUrl, {
      headers: {
        Cookie: `L=hindi,bengali`, // only on server
      },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
