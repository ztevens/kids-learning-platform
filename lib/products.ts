export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
}

// Pricing tiers for IYF STUDIO
export const PRODUCTS: Product[] = [
  {
    id: "basic-plan",
    name: "Basic Plan",
    description: "Perfect for getting started with learning",
    priceInCents: 999, // £9.99/month
    features: [
      "Access to core subjects",
      "Basic quizzes and exercises",
      "Progress tracking",
      "Weekly insights",
      "1 student account",
    ],
  },
  {
    id: "learner-plan",
    name: "Learner Plan",
    description: "Most popular for serious learners",
    priceInCents: 1999, // £19.99/month
    features: [
      "Everything in Basic",
      "Advanced quizzes",
      "Tutor assignments",
      "Live class access",
      "Up to 3 student accounts",
      "Priority support",
    ],
  },
  {
    id: "master-plan",
    name: "Master Plan",
    description: "Complete learning experience",
    priceInCents: 3999, // £39.99/month
    features: [
      "Everything in Learner",
      "Unlimited student accounts",
      "1-on-1 tutor sessions",
      "Personalized learning paths",
      "Advanced analytics",
      "Certificate of achievement",
      "Premium support",
    ],
  },
]
