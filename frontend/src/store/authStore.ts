import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,

      login: async (email: string, password: string) => {
        try {
          // Simulación de login exitoso por ahora
          if (email && password) {
            const mockUser = {
              id: 1,
              email: email,
              first_name: 'Usuario',
              last_name: 'Demo',
              role: 'admin'
            }
            
            set({
              isAuthenticated: true,
              user: mockUser,
              token: 'mock-token',
              error: null
            })
          } else {
            set({ error: 'Credenciales inválidas' })
          }
        } catch (error) {
          set({
            error: 'Error de autenticación',
            isAuthenticated: false
          })
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)
