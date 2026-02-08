import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Languages, BookOpen, Zap, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Languages className="h-5 w-5 text-primary" />
            LinguaLearn
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Learn Languages with
          <span className="text-primary"> Real-Time Translation</span>
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Translate text instantly, explore grammar with interactive hints, and build your personal dictionary.
        </p>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href="/signup">Start Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">See Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Real-Time Translation</h3>
            <p className="text-sm text-muted-foreground">
              Type and see translations appear instantly with 500ms debounce.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">12 Parts of Speech</h3>
            <p className="text-sm text-muted-foreground">
              Every word highlighted by grammar role with detailed explanations.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Personal Dictionary</h3>
            <p className="text-sm text-muted-foreground">
              Save words with one click and review them anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} LinguaLearn. All rights reserved.
      </footer>
    </div>
  )
}
