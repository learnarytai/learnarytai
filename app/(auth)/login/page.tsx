'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Languages } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
      } else {
        router.push('/translator')
        router.refresh()
      }
    } catch {
      toast.error('Sign in failed. Please try again.')
    }
    setLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-2 flex items-center justify-center gap-2">
            <Languages className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StudyLab</span>
          </Link>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth buttons */}
          <div className="grid gap-2">
            <Button variant="outline" onClick={() => handleOAuth('google')}>
              Continue with Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuth('github')}>
              Continue with GitHub
            </Button>
            <Button variant="outline" onClick={() => handleOAuth('apple')}>
              Continue with Apple
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
