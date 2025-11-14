import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';

export async function authenticateRequest(request: NextRequest) {
  try {
     const token = extractToken(request.headers.get('authorization') || undefined);
    
    if (!token) {
      return {
        authenticated: false,
        user: null,
        error: 'No token provided'
      };
    }

    const user = verifyToken(token);
    return {
      authenticated: true,
      user,
      error: null
    };
  } catch (error) {
    return {
      authenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
