"use client"

import { useState } from "react"
import { ArrowRight, Heart, ShieldCheck } from "lucide-react"
import { DonationModal } from "./donation-modal"
import { Eyebrow } from "@/components/site/section-heading"

export function Donation() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section id="donate" className="bg-[#f7f5f0] py-20 md:py-28">
        <div className="container-page">
          <div className="reveal-scale border border-slate-200 bg-white">
            <div className="grid items-center gap-10 p-7 md:p-12 lg:grid-cols-[1.1fr_1fr] lg:p-16">
              <div className="space-y-6">
                <Eyebrow>Support the Ministry</Eyebrow>
                <h3 className="font-serif text-4xl tracking-tight text-ink md:text-6xl">
                  Support the <span className="font-bold">Ministry</span>
                </h3>
                <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                  Your generous donation helps us continue spreading the gospel through music and reaching more hearts
                  with messages of faith and hope.
                </p>
              </div>

              <div className="border-l border-[#c4a36a] bg-[#f7f5f0] p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <Heart className="size-6 shrink-0 text-brand-strong" />
                  <div>
                    <h4 className="font-serif text-2xl tracking-tight text-ink">Make a Donation</h4>
                    <p className="text-sm text-slate-500">Support the ministry with any amount you feel led to give</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-600">
                  Whether it&apos;s a small token or a substantial gift, every donation makes a meaningful difference in
                  our ministry. Your generosity enables us to continue spreading faith, hope, and inspiration through
                  music.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group mt-7 flex h-14 w-full items-center justify-between bg-ink px-6 text-base font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Donate Now
                  <span className="grid size-8 place-items-center text-brand-glow">
                    <ArrowRight className="size-5" />
                  </span>
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="size-3.5" />
                  All donations are secure and go directly to supporting the ministry
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DonationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
