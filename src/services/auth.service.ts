import { auth } from '@/lib/auth';
import { UserRepository } from '@/lib/repositories/user.repository';
import { 
  RegisterInput, 
  LoginInput, 
  ForgotPasswordInput, 
  ResetPasswordInput
} from '@/validations/auth';
import { headers } from 'next/headers';

const userRepository = new UserRepository();

export class AuthService {
  /**
   * Retrieves the current user session on the server.
   * Useful for Server Components, Server Actions, and API Routes.
   */
  static async getServerSession() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  }

  /**
   * Registers a new user using Better Auth.
   * Better Auth automatically hashes the password and creates the user record.
   */
  static async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    // Call Better Auth api to register on server
    // Better Auth will hash the password and insert to mongodb
    const result = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        phone: input.phone,
        role: 'USER', // Default user role
      } as any,
    });

    return result;
  }

  /**
   * Logs in a user on the server.
   */
  static async login(input: LoginInput) {
    const result = await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
      headers: await headers(), // Ensure session cookies are set correctly
    });

    return result;
  }

  /**
   * Initiates forgot password flow, sending an email via Better Auth.
   */
  static async forgotPassword(input: ForgotPasswordInput) {
    const result = await auth.api.requestPasswordReset({
      body: {
        email: input.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
      },
    });
    return result;
  }

  /**
   * Resets password using a verification token from the URL.
   */
  static async resetPassword(token: string, input: ResetPasswordInput) {
    const result = await auth.api.resetPassword({
      body: {
        newPassword: input.password,
        token,
      },
    });
    return result;
  }

  /**
   * Verifies email using a verification token.
   */
  static async verifyEmail(token: string) {
    const result = await auth.api.verifyEmail({
      query: {
        token,
      },
    });
    return result;
  }

  /**
   * Logs out the current user session on the server.
   */
  static async logout() {
    const result = await auth.api.signOut({
      headers: await headers(),
    });
    return result;
  }

  /**
   * Retrieves profile details including user addresses.
   */
  static async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const addresses = await userRepository.getUserAddresses(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
      addresses,
    };
  }

  /**
   * Checks if user has admin privileges.
   */
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await userRepository.findById(userId);
    return user?.role === 'ADMIN';
  }
}
