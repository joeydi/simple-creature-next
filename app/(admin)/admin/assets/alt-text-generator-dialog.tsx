"use client"

import { FormEvent, useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { generateAltText } from "./actions"
import Image from "next/image"

type View = "input" | "loading" | "result"

interface AltTextGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  onAccept: (altText: string) => void
}

export function AltTextGeneratorDialog({ open, onOpenChange, imageUrl, onAccept }: AltTextGeneratorDialogProps) {
  const [keywords, setKeywords] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>("input")
  const [isPending, startTransition] = useTransition()

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault()

    setError(null)
    setCurrentView("loading")

    startTransition(async () => {
      try {
        const altText = await generateAltText(imageUrl, keywords || undefined)
        setGeneratedText(altText)
        setCurrentView("result")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate alt text")
        setCurrentView("result")
      }
    })
  }

  const handleAccept = () => {
    if (generatedText) {
      onAccept(generatedText)
      handleClose()
    }
  }

  const handleRetry = () => {
    setError(null)
    setGeneratedText("")
    setCurrentView("input")
  }

  const handleClose = () => {
    setKeywords("")
    setGeneratedText("")
    setError(null)
    setCurrentView("input")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {/* Input View */}
        {currentView === "input" && (
          <>
            <DialogHeader>
              <DialogTitle>Generate Alt Text</DialogTitle>
              <DialogDescription>Use AI to generate accessible alt text for this image</DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleGenerate}>
              {/* Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 640px"
                />
              </div>

              {/* Keywords Input */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (optional)</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., coffee, latte art, cafe"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">Provide 1-2 keywords to help guide the AI generation</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Generate
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Loading View */}
        {currentView === "loading" && (
          <>
            <DialogHeader>
              <DialogTitle>Generating Alt Text...</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing image with AI...</p>
            </div>
          </>
        )}

        {/* Result View */}
        {currentView === "result" && (
          <>
            <DialogHeader>
              <DialogTitle>{error ? "Generation Failed" : "Generated Alt Text"}</DialogTitle>
              {!error && <DialogDescription>Review the generated alt text below</DialogDescription>}
            </DialogHeader>

            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive bg-destructive/10 p-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              )}

              {/* Generated Text */}
              {generatedText && !error && (
                <div className="space-y-2">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm leading-relaxed">{generatedText}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Character count: {generatedText.length}/125</span>
                    {generatedText.length > 125 && (
                      <span className="text-orange-600">Warning: Exceeds recommended length</span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                {error ? (
                  <Button type="button" onClick={handleRetry}>
                    Retry
                  </Button>
                ) : (
                  <Button type="button" onClick={handleAccept} autoFocus>
                    Accept
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
