'use client'

import type { Profile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap } from 'lucide-react'

interface SubscriptionCardProps {
  profile: Profile
}

export function SubscriptionCard({ profile }: SubscriptionCardProps) {
  const isPro = profile.subscription_tier === 'pro'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Subscription
          <Badge variant={isPro ? 'default' : 'secondary'}>
            {isPro ? 'Pro' : 'Free'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            {isPro ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <Zap className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-medium">
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {isPro ? (
              <>
                <li>&#10003; Unlimited characters</li>
                <li>&#10003; All languages</li>
                <li>&#10003; Priority support</li>
              </>
            ) : (
              <>
                <li>&#10003; {profile.characters_limit.toLocaleString()} characters/month</li>
                <li>&#10003; All languages</li>
                <li>
                  Used: {profile.characters_used.toLocaleString()}/
                  {profile.characters_limit.toLocaleString()}
                </li>
              </>
            )}
          </ul>
        </div>
        {!isPro && (
          <Button className="w-full" asChild>
            <a href="/pricing">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
