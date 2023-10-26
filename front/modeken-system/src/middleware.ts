import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin', '/total'],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1];
    const [user, password] = Buffer.from(auth, 'base64').toString('utf-8').split(':');

    if (user === process.env.BASIC_AUTH_NAME && password === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new Response('Basic Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    }
  });
}
