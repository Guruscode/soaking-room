"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Globe2, Landmark, Mail } from "lucide-react"
import { useState } from "react"

export function BankDetails() {
  const [copied, setCopied] = useState<string | null>(null)

  const bankDetails = {
    local: {
      label: "Local Payments",
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

  const Field = ({
    label,
    value,
    copyKey,
    bold = false,
  }: {
    label: string
    value: string
    copyKey: string
    bold?: boolean
  }) => (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border/60">
        <span className={`text-foreground flex-1 font-mono text-sm ${bold ? "font-bold" : ""}`}>{value}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(value, copyKey)}
          className="h-8 w-8 p-0"
        >
          {copied === copyKey ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  )

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-[0.2em]">
            Ways To Give
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">Bank Transfer Details</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            You can support the ministry through direct bank transfer using the details below.
          </p>
        </div>

        <Card className="border-border rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent">
            <CardTitle className="text-foreground text-2xl">Donation Account Information</CardTitle>
            <CardDescription className="text-base text-foreground font-semibold">
              Please use these details for your international transfers
            </CardDescription>
            <div className="mt-3 rounded-lg border border-primary/40 bg-primary/15 px-3 py-2 text-sm font-semibold text-primary flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              International transfers: double-check the SWIFT code and account name before sending.
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Local Payments</p>
                    <p className="text-base font-semibold text-foreground">{bankDetails.local.accountName}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Account Number</p>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border/60">
                    <span className="text-foreground flex-1 font-mono text-sm font-bold">
                      {bankDetails.local.accountNumber}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bankDetails.local.accountNumber, "local-number")}
                      className="h-8 w-8 p-0"
                    >
                      {copied === "local-number" ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{bankDetails.local.bankName}</p>
              </div>

              <div className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">International (GBP / EUR)</p>
                    <p className="text-sm text-muted-foreground">Use these for GBP and Euro transfers</p>
                  </div>
                </div>
                {bankDetails.intl.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-primary/40 shadow-sm">
                      <span className="text-foreground flex-1 font-mono text-sm font-bold">{item.accountNumber}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.accountNumber, item.label)}
                        className="h-8 w-8 p-0"
                      >
                        {copied === item.label ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">USD Account</p>
                    <p className="text-sm text-muted-foreground">Use SWIFT for USD transfers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Account Number</p>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-border/60">
                    <span className="text-foreground flex-1 font-mono text-sm font-bold">{bankDetails.usd.accountNumber}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bankDetails.usd.accountNumber, "usd-number")}
                      className="h-8 w-8 p-0"
                    >
                      {copied === "usd-number" ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Account Name" value={bankDetails.usd.accountName} copyKey="usd-name" />
                  <Field label="SWIFT Code" value={bankDetails.usd.swiftCode} copyKey="usd-swift" bold />
                </div>
                <p className="text-sm text-muted-foreground">{bankDetails.usd.bankName}</p>
              </div>

              <div className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">CAD Account</p>
                    <p className="text-sm text-muted-foreground">Send via email transfer</p>
                  </div>
                </div>
                <Field label="Email" value={bankDetails.cad.email} copyKey="cad-email" />
              </div>
            </div>

            {/* Bank Address */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-semibold text-foreground">Bank Address</label>
              <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                <span className="text-foreground flex-1 text-sm">{bankDetails.bankAddress}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.bankAddress, "address")}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  {copied === "address" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Note:</span> Please ensure all details are correct before making your
                transfer. Your donation will directly support the ministry's mission.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
