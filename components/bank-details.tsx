"use client"

import { useState } from "react"
import { Check, Copy, Globe2, Info, Landmark, Mail } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { SectionHeading } from "@/components/site/section-heading"
import { cn } from "@/lib/utils"

const bankDetails = {
  local: {
    accountName: "The Soaking Room Ministry",
    accountNumber: "0724648927",
    bankName: "Guarantee Trust Bank PLC",
  },
  intl: [
    { label: "GBP Account", accountNumber: "0255815577" },
    { label: "EURO Account", accountNumber: "0255815656" },
  ],
  usd: {
    accountNumber: "0255815560",
    accountName: "Moses Akoh Oche",
    bankName: "Guarantee Trust Bank PLC",
    swiftCode: "GTBIGB2L",
  },
  cad: {
    email: "Ocheakoh@gmail.com",
  },
  bankAddress: "Atlantic Mall, Utako, FCT Abuja",
}

function Panel({
  icon: Icon,
  label,
  hint,
  dark,
  children,
}: {
  icon: LucideIcon
  label: string
  hint?: ReactNode
  dark?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "space-y-5 rounded-[1.75rem] p-6 md:p-7",
        dark ? "bg-ink text-white" : "border border-slate-200 bg-white",
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("grid size-11 place-items-center rounded-2xl", dark ? "bg-white/10 text-brand-glow" : "bg-brand-soft text-brand-strong")}>
          <Icon className="size-5" />
        </span>
        <div>
          <p className={cn("eyebrow text-[0.68rem]", dark ? "text-cyan-300" : "text-slate-500")}>{label}</p>
          {hint ? <p className={cn("text-sm", dark ? "text-slate-300" : "text-slate-600")}>{hint}</p> : null}
        </div>
      </div>
      {children}
    </div>
  )
}

export function BankDetails() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const Field = ({ label, value, copyKey, dark = false, mono = true }: { label: string; value: string; copyKey: string; dark?: boolean; mono?: boolean }) => (
    <div className="space-y-1.5">
      <p className={cn("text-xs font-medium", dark ? "text-slate-400" : "text-slate-500")}>{label}</p>
      <button
        type="button"
        onClick={() => copyToClipboard(value, copyKey)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors",
          dark ? "bg-white/5 ring-1 ring-white/10 hover:bg-white/10" : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300",
        )}
        aria-label={`Copy ${label}`}
      >
        <span className={cn("min-w-0 flex-1 break-all text-[0.95rem] font-semibold", mono && "font-mono tabular-nums tracking-wide")}>{value}</span>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
            copied === copyKey ? "bg-brand text-white" : dark ? "bg-white/10 text-slate-300" : "bg-white text-slate-500 ring-1 ring-slate-200",
          )}
        >
          {copied === copyKey ? <Check className="size-4" /> : <Copy className="size-3.5" />}
        </span>
      </button>
    </div>
  )

  return (
    <section id="contact" className="bg-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Ways To Give"
          title={
            <>
              Bank Transfer <span className="font-bold">Details</span>
            </>
          }
          description="You can support the ministry through direct bank transfer using the details below."
        />

        <div className="reveal mt-10 flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand-soft px-5 py-4 text-sm font-medium text-cyan-900">
          <Globe2 className="mt-0.5 size-4 shrink-0" />
          <p>
            <span className="font-semibold">Donation Account Information.</span> Please use these details for your
            international transfers. International transfers: double-check the SWIFT code and account name before
            sending.
          </p>
        </div>

        <div className="reveal-stagger mt-6 grid gap-5 lg:grid-cols-2">
          <Panel icon={Landmark} label="Local Payments" hint={bankDetails.local.accountName} dark>
            <Field label="Account Number" value={bankDetails.local.accountNumber} copyKey="local-number" dark />
            <p className="text-sm text-slate-400">{bankDetails.local.bankName}</p>
          </Panel>

          <Panel icon={Globe2} label="International (GBP / EUR)" hint="Use these for GBP and Euro transfers">
            {bankDetails.intl.map((item) => (
              <Field key={item.label} label={item.label} value={item.accountNumber} copyKey={item.label} />
            ))}
          </Panel>

          <Panel icon={Globe2} label="USD Account" hint="Use SWIFT for USD transfers">
            <Field label="Account Number" value={bankDetails.usd.accountNumber} copyKey="usd-number" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account Name" value={bankDetails.usd.accountName} copyKey="usd-name" mono={false} />
              <Field label="SWIFT Code" value={bankDetails.usd.swiftCode} copyKey="usd-swift" />
            </div>
            <p className="text-sm text-slate-500">{bankDetails.usd.bankName}</p>
          </Panel>

          <Panel icon={Mail} label="CAD Account" hint="Send via email transfer">
            <Field label="Email" value={bankDetails.cad.email} copyKey="cad-email" mono={false} />
          </Panel>
        </div>

        <div className="reveal mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7">
            <Field label="Bank Address" value={bankDetails.bankAddress} copyKey="address" mono={false} />
          </div>
          <div className="flex items-start gap-3 rounded-[1.75rem] bg-surface-soft p-6 text-sm text-slate-700 md:p-7">
            <Info className="mt-0.5 size-4 shrink-0 text-brand" />
            <p>
              <span className="font-semibold">Note:</span> Please ensure all details are correct before making your
              transfer. Your donation will directly support the ministry&apos;s mission.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
