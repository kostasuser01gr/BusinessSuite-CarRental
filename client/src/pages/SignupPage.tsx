import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { apiFetch } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import { signupSchema } from '../../../shared/schemas'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const result = signupSchema.safeParse({ name, email, password })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    setLoading(true)
    try {
      const userData = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      setUser(userData)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-input focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-input focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background border-input focus:border-primary transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
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
