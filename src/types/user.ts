export type UserRole = 'CUSTOMER' | 'PICKER' | 'ADMIN' | 'OWNER';

export interface User {
  id: string;
  sessionId: string;
  name: string;
  phone?: string;
  email?: string;
  role: UserRole;
  currentStoreId?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  isActive: boolean;
}

export interface Session {
  id: string;
  userId: string;
  storeId: string;
  cartId?: string;
  startedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
}
