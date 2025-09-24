import React, { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Shield, Users, Brain } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<'patient' | 'doctor' | 'admin'>('patient')

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 items-center justify-center p-12">
        <div className="max-w-md text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Heart className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Your Health, Our Priority
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with healthcare professionals, track your health, and get AI-powered insights for better wellness.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">24/7 health support</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Expert Doctors</h3>
                <p className="text-sm text-muted-foreground">Professional care</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">Privacy protected</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Health Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor progress</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* User Type Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-3 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setUserType('patient')}
                className={`py-2 px-4 rounded-md transition-all ${
                  userType === 'patient'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login as Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className={`py-2 px-4 rounded-md transition-all ${
                  userType === 'doctor'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login as Doctor
              </button>
              <button
                onClick={() => setUserType('admin')}
                className={`py-2 px-4 rounded-md transition-all ${
                  userType === 'admin'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login as Admin
              </button>
            </div>
          </div>

          {isLogin ? (
            <LoginForm 
              onToggleMode={() => setIsLogin(false)} 
              userType={userType}
            />
          ) : (
            <RegisterForm 
              onToggleMode={() => setIsLogin(true)} 
              userType={userType}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth