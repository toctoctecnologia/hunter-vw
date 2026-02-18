import { type FormEvent, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { HunterLogo } from '@/components/branding/HunterLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { debugLog } from '@/utils/debug'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      debugLog('Login attempt:', { email, password })
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white md:grid md:grid-cols-2">
      {/* Left Panel - Login Form */}
      <div className="flex w-full items-center justify-center px-8 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <HunterLogo className="h-12 w-auto" />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="remember" className="text-sm text-slate-600">Remember for 30 days</Label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 transition"
              >
                Forgot password
              </button>
            </div>

            <Button 
              type="submit" 
              variant="orange" 
              className="h-11 w-full text-base font-semibold" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="h-11 w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </form>

          <div className="text-center">
            <span className="text-slate-600">Don't have an account? </span>
            <button className="font-medium text-orange-600 hover:text-orange-700 transition">
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=80"
            alt="Real estate professional"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-700/90" />
        </div>
        
        <div className="relative z-10 max-w-lg px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            "We've been using Hunter to kick start every new project and can't imagine working without it."
          </h2>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4" />
            <p className="font-semibold">Olivia Rhye</p>
            <p className="text-orange-100">Founder, Huddle</p>
          </div>
        </div>
      </div>
    </div>
  )
}
