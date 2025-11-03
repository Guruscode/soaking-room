"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useState } from "react"
import { DonationModal } from "./donation-modal"

export function Donation() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section id="donate" className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Support the Ministry</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your generous donation helps us continue spreading the gospel through music and reaching more hearts with
              messages of faith and hope.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto rounded-xl border-border shadow-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-primary mx-auto">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-foreground">Make a Donation</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Support the ministry with any amount you feel led to give
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground text-center">
                Whether it's a small token or a substantial gift, every donation makes a meaningful difference in our
                ministry. Your generosity enables us to continue spreading faith, hope, and inspiration through music.
              </p>
              <Button
                onClick={() => setModalOpen(true)}
                className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                Donate Now
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                All donations are secure and go directly to supporting the ministry
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <DonationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
