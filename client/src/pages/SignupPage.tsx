import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { apiFetch } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import { SignupInput } from '../../../shared/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { animateFadeInUp, animateHoverLift, animatePress } from '../animations'
import { useToast } from '../providers/ToastProvider'
import { signupFormSchema, SignupFormInput } from '../schemas/auth'

export default function SignupPage() {
  const { setUser } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (data: SignupInput) => {
      return apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: (userData) => {
      setUser(userData)
      addToast(`Account created! Welcome, ${userData.name}.`, 'success')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      addToast(error.message || 'Failed to sign up', 'error')
    }
  })

  useEffect(() => {
    if (containerRef.current) {
      animateFadeInUp(containerRef.current)
    }
  }, [])

  const onSubmit = (data: SignupFormInput) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans opacity-0" ref={containerRef}>
      <Card className="w-full max-w-md border-border bg-card shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground mb-4 shadow-lg shadow-primary/20 transition-transform hover:scale-110 duration-300">
            A
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Create account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="bg-background border-input focus:border-primary transition-colors"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
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
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                className="bg-background border-input focus:border-primary transition-colors"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-background border-input focus:border-primary transition-colors"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]" 
              type="submit" 
              loading={signupMutation.isPending}
              disabled={signupMutation.isPending}
              onClick={(e) => {
                animatePress(e.currentTarget)
              }}
              onMouseEnter={(e) => animateHoverLift(e.currentTarget, true)}
              onMouseLeave={(e) => animateHoverLift(e.currentTarget, false)}
            >
              {signupMutation.isPending ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline transition-all underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
