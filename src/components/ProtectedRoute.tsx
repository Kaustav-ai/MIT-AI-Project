import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  role?: 'doctor' | 'patient' | 'admin' | 'any'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role = 'any' }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  // Optional role enforcement using Supabase user metadata
  const userType = (user.user_metadata as any)?.user_type as string | undefined
  if (role !== 'any' && userType && role !== userType) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute