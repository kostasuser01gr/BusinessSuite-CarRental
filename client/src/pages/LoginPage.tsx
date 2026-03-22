import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { apiFetch } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import { loginSchema, LoginInput } from '../../../shared/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { animateFadeInUp, animateHoverLift, animatePress } from '../animations'
import { useToast } from '../providers/ToastProvider'

export default function LoginPage() {
  const { setUser } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: (userData) => {
      setUser(userData)
      addToast(`Welcome back, ${userData.name}!`, 'success')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      addToast(error.message || 'Invalid email or password', 'error')
    }
  })

  useEffect(() => {
    if (containerRef.current) {
      animateFadeInUp(containerRef.current)
    }
  }, [])

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans opacity-0" ref={containerRef}>
      <Card className="w-full max-w-md border-border bg-card shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground mb-4 shadow-lg shadow-primary/20 transition-transform hover:scale-110 duration-300">
            A
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your AdaptiveAI Business Suite account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="bg-background border-input focus:border-primary transition-colors"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                  Password
                </label>
                <span className="text-sm text-primary hover:text-primary/80 transition-colors opacity-50 cursor-not-allowed">
                  Forgot password?
                </span>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-background border-input focus:border-primary transition-colors"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]" 
              type="submit" 
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              onClick={(e) => {
                animatePress(e.currentTarget)
              }}
              onMouseEnter={(e) => animateHoverLift(e.currentTarget, true)}
              onMouseLeave={(e) => animateHoverLift(e.currentTarget, false)}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline transition-all underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
