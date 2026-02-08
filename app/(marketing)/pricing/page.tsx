import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Languages, Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Languages className="h-5 w-5 text-primary" />
            LinguaLearn
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Pricing */}
      <section className="flex flex-1 flex-col items-center px-4 py-16">
        <h1 className="mb-2 text-3xl font-bold">Simple Pricing</h1>
        <p className="mb-10 text-muted-foreground">
          Start free, upgrade when you need more.
        </p>

        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Free */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Free
                <Badge variant="secondary">Current</Badge>
              </CardTitle>
              <p className="text-3xl font-bold">
                $0<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  1,000 characters/month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  All 10 languages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Personal dictionary
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Grammar highlights
                </li>
              </ul>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pro
                <Badge>Popular</Badge>
              </CardTitle>
              <p className="text-3xl font-bold">
                $9<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Unlimited characters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  All 10 languages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Personal dictionary
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Priority support
                </li>
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/signup">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
