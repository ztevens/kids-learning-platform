import { PRODUCTS } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"
import { CheckoutButton } from "@/components/pricing/checkout-button"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-3xl font-bold text-blue-600">Dominus Learning</h1>
            </Link>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">Choose Your Learning Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock your child's potential with our gamified learning platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRODUCTS.map((product, index) => (
            <Card
              key={product.id}
              className={`relative hover:shadow-2xl transition-all ${
                index === 1 ? "border-blue-600 border-2 scale-105" : "hover:scale-105"
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">£{(product.priceInCents / 100).toFixed(2)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton productId={product.id} productName={product.name} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <Badge variant="secondary" className="px-4 py-2">
              Cancel anytime
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Secure payments
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              24/7 support
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Money-back guarantee
            </Badge>
          </div>
        </div>
      </main>
    </div>
  )
}
