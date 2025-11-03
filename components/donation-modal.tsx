"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface DonationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const bankDetails = {
    accountName: "Moses Akoh Oche",
    accountNumber: "0255815560",
    bankName: "Guarantee Trust Bank PLC",
    swiftCode: "GTBIGB2L",
    bankAddress: "Cadastral Zone, CBD, Abuja",
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Bank Transfer Details</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Use these details to make your donation to support the ministry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Account Name</label>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                <span className="text-foreground flex-1 font-mono text-sm">{bankDetails.accountName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.accountName, "name")}
                  className="h-8 w-8 p-0"
                >
                  {copied === "name" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Account Number</label>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                <span className="text-foreground flex-1 font-mono text-sm font-bold">{bankDetails.accountNumber}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.accountNumber, "number")}
                  className="h-8 w-8 p-0"
                >
                  {copied === "number" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Bank Name</label>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                <span className="text-foreground flex-1 font-mono text-sm">{bankDetails.bankName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.bankName, "bank")}
                  className="h-8 w-8 p-0"
                >
                  {copied === "bank" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Swift Code */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Swift Code</label>
              <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                <span className="text-foreground flex-1 font-mono text-sm font-bold">{bankDetails.swiftCode}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(bankDetails.swiftCode, "swift")}
                  className="h-8 w-8 p-0"
                >
                  {copied === "swift" ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
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

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Note:</span> Please ensure all details are correct before making your
              transfer. Your donation will directly support the ministry's mission.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
