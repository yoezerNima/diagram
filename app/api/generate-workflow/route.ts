import { type NextRequest, NextResponse } from "next/server"

export interface WorkflowInput {
  title: string
  manualSteps: string[]
  automationSteps: string[]
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting workflow generation")
    const body: WorkflowInput = await request.json()
    console.log("[v0] Received request body:", JSON.stringify(body))

    // Validate input
    if (!body.title || !Array.isArray(body.manualSteps) || !Array.isArray(body.automationSteps)) {
      return NextResponse.json(
        { error: "Invalid input. Required: title (string), manualSteps (array), automationSteps (array)" },
        { status: 400 },
      )
    }

    console.log("[v0] Generating workflow diagram")
    const { generateWorkflowDiagram } = await import("@/lib/diagram-generator")
    const diagramBuffer = await generateWorkflowDiagram({
      title: body.title,
      manualSteps: body.manualSteps,
      automationSteps: body.automationSteps,
    })
    console.log("[v0] Diagram generated successfully, buffer size:", diagramBuffer.length)

    return new NextResponse(new Uint8Array(diagramBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${encodeURIComponent(body.title)}.png"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating workflow document:", error)
    return NextResponse.json(
      {
        error: "Failed to generate workflow document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
