import { createContext, useContext, type ReactNode } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>('token', null)
  const [user, setUser] = useLocalStorage<User | null>('user', null)

  function login(newToken: string, userData: User) {
    setToken(newToken)
    setUser(userData)
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}