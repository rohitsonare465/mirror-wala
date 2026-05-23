import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Trigger hot reload compilation
export const { GET, POST } = toNextJsHandler(auth);
