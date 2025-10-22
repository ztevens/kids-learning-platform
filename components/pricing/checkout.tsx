"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"

// Only initialize stripe if we have the publishable key
const getStripePromise = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!publishableKey) {
    console.error("Stripe publishable key is not set")
    return null
  }
  return loadStripe(publishableKey)
}

export function Checkout({ productId }: { productId: string }) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  
  useEffect(() => {
    setStripePromise(getStripePromise())
  }, [])

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startCheckoutSession(productId)
      return clientSecret as string
    } catch (error) {
      console.error("Error fetching checkout session:", error)
      throw error
    }
  }, [productId])

  if (!stripePromise) {
    return <div className="p-4 text-center">Payment system not configured properly</div>
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}