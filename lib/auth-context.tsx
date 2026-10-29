'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  ANALYST = 'ANALYST',
  INTEL_ANALYST = 'INTEL_ANALYST',
}

export enum ClearanceLevel {
  CL5_TOP_SECRET = 'CL5_TOP_SECRET',
  CL4_COUNTER_INTEL = 'CL4_COUNTER_INTEL',
  CL3_RESTRICTED = 'CL3_RESTRICTED',
  CL2_SECURITY = 'CL2_SECURITY',
  CL1_PUBLIC = 'CL1_PUBLIC',
}

export interface UserSession {
  userId: string
  fullName: string
  role: UserRole
  clearance: ClearanceLevel
  organization: string
}

interface AuthContextType {
  session: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize session from localStorage
  useEffect(() => {
    const initSession = () => {
      try {
        const userStr = localStorage.getItem('user')
        const token = localStorage.getItem('access_token')

        if (userStr && token) {
          const userData = JSON.parse(userStr)
          setSession({
            userId: userData.id || '',
            fullName: userData.fullName || '',
            role: userData.role || UserRole.INTEL_ANALYST,
            clearance: userData.clearance || ClearanceLevel.CL2_SECURITY,
            organization: userData.organization || 'MINISTRY_OF_SECURITY',
          })
        }
      } catch (error) {
        console.error('Error initializing session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json()
      
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      const user = data.user
      setSession({
        userId: user.id || '',
        fullName: user.fullName || '',
        role: user.role || UserRole.INTEL_ANALYST,
        clearance: user.clearance || ClearanceLevel.CL2_SECURITY,
        organization: user.organization || 'MINISTRY_OF_SECURITY',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
