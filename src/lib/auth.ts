import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { EmailService } from '@/services/email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  baseURL: {
    allowedHosts: [
      'mirrorwala.in',
      '*.mirrorwala.in',
      'mirrorwala.com',
      '*.mirrorwala.com',
      'mirror-wala.vercel.app',
      '*.vercel.app',
      'localhost:3000',
      'localhost:3001',
    ],
  },

  trustedOrigins: [
    'https://mirrorwala.in',
    'https://*.mirrorwala.in',
    'https://mirrorwala.com',
    'https://*.mirrorwala.com',
    'https://mirror-wala.vercel.app',
    'https://*.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL.replace(/\/$/, '')] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')] : []),
  ],
  emailAndPassword: {

    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false, // Set to true if email verification is mandatory
    sendResetPassword: async ({ user, url }) => {
      await EmailService.sendPasswordResetEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await EmailService.sendVerificationEmail(user.email, url);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
        input: false,
      },
      phone: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
});

