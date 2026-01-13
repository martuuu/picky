import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@/types/user';

interface UserStore {
  user: User | null;
  session: Session | null;
  
  // Actions
  initSession: (storeId: string) => void;
  updateUser: (userData: Partial<User>) => void;
  clearSession: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,

      initSession: (storeId: string) => {
        const existingSession = get().session;
        
        // Si ya hay una sesión activa para esta tienda, no crear una nueva
        if (existingSession && existingSession.storeId === storeId) {
          set({
            session: {
              ...existingSession,
              lastActivityAt: new Date(),
            },
          });
          return;
        }

        // Crear nueva sesión
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newUser: User = {
          id: userId,
          sessionId,
          name: 'Cliente Anónimo',
          role: 'CUSTOMER',
          currentStoreId: storeId,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        const newSession: Session = {
          id: sessionId,
          userId,
          storeId,
          startedAt: new Date(),
          lastActivityAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        };

        set({
          user: newUser,
          session: newSession,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ...userData,
            lastLoginAt: new Date(),
          },
        });
      },

      clearSession: () => {
        set({
          user: null,
          session: null,
        });
      },
    }),
    {
      name: 'picky-user-storage',
    }
  )
);
