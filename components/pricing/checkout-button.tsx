"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkout } from "@/components/pricing/checkout"

interface CheckoutButtonProps {
  productId: string
  productName: string
}

export function CheckoutButton({ productId, productName }: CheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setIsOpen(true)}>
        Get Started
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscribe to {productName}</DialogTitle>
            <DialogDescription>Complete your payment to start learning</DialogDescription>
          </DialogHeader>
          <Checkout productId={productId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
