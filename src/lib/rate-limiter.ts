import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000);

export function checkRateLimit(
  req: NextRequest,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; headers: Headers; isBot: boolean } {
  // Try to identify user by IP or specific header if IP isn't available
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const userId = req.headers.get('authorization')?.split(' ')[1]?.substring(0, 10) || 'anon';
  const key = `${ip}_${userId}`;
  
  const now = Date.now();
  
  if (!store[key] || store[key].resetTime < now) {
    store[key] = { count: 1, resetTime: now + windowMs };
  } else {
    store[key].count++;
  }

  const remaining = Math.max(0, limit - store[key].count);
  const reset = new Date(store[key].resetTime).toISOString();
  
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', reset);

  // Custom Bot Detection (heuristic)
  // If user requests 3x the normal limit, we flag them as a potential bot
  const isBot = store[key].count > limit * 3;

  return { 
    success: store[key].count <= limit, 
    headers,
    isBot 
  };
}
