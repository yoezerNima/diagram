"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Download } from "lucide-react"

export default function Home() {
  const [title, setTitle] = useState("Customer Onboarding Process")
  const [manualSteps, setManualSteps] = useState(
    "Receive customer application\nReview customer documents\nVerify customer identity",
  )
  const [automationSteps, setAutomationSteps] = useState(
    "Send automated welcome email\nCreate customer account in system\nGenerate onboarding checklist",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      setImageUrl(null)
    }

    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          manualSteps: manualSteps.split("\n").filter((s) => s.trim()),
          automationSteps: automationSteps.split("\n").filter((s) => s.trim()),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate workflow")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return

    const a = document.createElement("a")
    a.href = imageUrl
    a.download = `${title.replace(/\s+/g, "_")}_workflow.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Workflow Diagram Generator</h1>
          <p className="text-lg text-muted-foreground">Create process flow diagrams as PNG images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Details</CardTitle>
                <CardDescription>Enter your workflow title and steps below. One step per line.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Workflow Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter workflow title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-steps">Manual Steps</Label>
                  <Textarea
                    id="manual-steps"
                    value={manualSteps}
                    onChange={(e) => setManualSteps(e.target.value)}
                    placeholder="Enter manual steps (one per line)"
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">These steps will have white backgrounds</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="automation-steps">Automation Steps</Label>
                  <Textarea
                    id="automation-steps"
                    value={automationSteps}
                    onChange={(e) => setAutomationSteps(e.target.value)}
                    placeholder="Enter automation steps (one per line)"
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">These steps will have gray backgrounds</p>
                </div>

                {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

                <Button onClick={handleGenerate} disabled={isLoading || !title.trim()} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Diagram...
                    </>
                  ) : (
                    "Generate Diagram"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>Use this endpoint in Power Automate or other services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Endpoint</Label>
                    <code className="block mt-1 p-3 bg-muted rounded text-sm">POST /api/generate-workflow</code>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Request Body</Label>
                    <pre className="mt-1 p-3 bg-muted rounded text-xs overflow-x-auto">
                      {`{
  "title": "Process Name",
  "manualSteps": ["Step 1", "Step 2"],
  "automationSteps": ["Auto Step 1"]
}`}
                    </pre>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Response</Label>
                    <p className="mt-1 text-sm text-muted-foreground">PNG image file (image/png)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generated workflow diagram will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <img src={imageUrl || "/placeholder.svg"} alt="Workflow Diagram" className="w-full h-auto" />
                    </div>
                    <Button onClick={handleDownload} className="w-full bg-transparent" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground text-sm">No diagram generated yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
