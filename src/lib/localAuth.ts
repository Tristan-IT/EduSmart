/**
 * Local Authentication System - No Backend Required
 * Uses localStorage to store user data
 */

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed in production
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  className?: string;
  nis?: string;
  school?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<LocalUser, 'password'>;
}

const USERS_KEY = 'adapti_users';
const CURRENT_USER_KEY = 'adapti_current_user';

/**
 * Get all registered users
 */
function getUsers(): LocalUser[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

/**
 * Save users to localStorage
 */
function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Generate a simple token (UUID-like)
 */
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Simple password hashing (in production, use bcrypt or similar)
 */
function hashPassword(password: string): string {
  // For demo purposes, just reverse it (NOT SECURE - use proper hashing in production)
  return btoa(password);
}

/**
 * Verify password
 */
function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

/**
 * Register a new user
 */
export async function localRegister(data: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  className?: string;
  nis?: string;
  school?: string;
}): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      // Check if email already exists
      if (users.find(u => u.email === data.email)) {
        reject(new Error('Email sudah terdaftar'));
        return;
      }

      // Create new user
      const newUser: LocalUser = {
        id: generateUserId(),
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
        role: data.role,
        className: data.className,
        nis: data.nis,
        school: data.school,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push(newUser);
      saveUsers(users);

      // Generate token
      const token = generateToken();

      // Save current user session
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ token, user: userWithoutPassword }));

      resolve({
        token,
        user: userWithoutPassword,
      });
    }, 500); // Simulate network delay
  });
}

/**
 * Login user
 */
export async function localLogin(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      // Find user by email
      const user = users.find(u => u.email === data.email);

      if (!user) {
        reject(new Error('Email tidak ditemukan'));
        return;
      }

      // Verify password
      if (!verifyPassword(data.password, user.password)) {
        reject(new Error('Password salah'));
        return;
      }

      // Generate token
      const token = generateToken();

      // Save current user session
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ token, user: userWithoutPassword }));

      resolve({
        token,
        user: userWithoutPassword,
      });
    }, 500); // Simulate network delay
  });
}

/**
 * Logout user
 */
export function localLogout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Get current user session
 */
export function getCurrentSession(): AuthResponse | null {
  const session = localStorage.getItem(CURRENT_USER_KEY);
  return session ? JSON.parse(session) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

/**
 * Initialize demo users (for testing)
 */
export function initializeDemoUsers(): void {
  const users = getUsers();
  
  if (users.length === 0) {
    const demoUsers: LocalUser[] = [
      {
        id: 'user_demo_student',
        name: 'Tristan Firdaus',
        email: 'tristan@student.com',
        password: hashPassword('password123'),
        role: 'student',
        className: 'X IPA 1',
        nis: '12345',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tristan',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user_demo_teacher',
        name: 'Bu Sarah',
        email: 'sarah@teacher.com',
        password: hashPassword('teacher123'),
        role: 'teacher',
        school: 'SMA Negeri 1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user_demo_admin',
        name: 'Admin Portal',
        email: 'admin@school.com',
        password: hashPassword('admin123'),
        role: 'admin',
        school: 'Portal Adaptif',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        createdAt: new Date().toISOString(),
      },
    ];

    saveUsers(demoUsers);
    console.log('Demo users initialized:', {
      student: 'tristan@student.com / password123',
      teacher: 'sarah@teacher.com / teacher123',
      admin: 'admin@school.com / admin123',
    });
  }
}
