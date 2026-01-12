import { createCanvas } from "canvas"

export interface DiagramInput {
  title: string
  manualSteps: string[]
  automationSteps: string[]
}

const CANVAS_WIDTH = 800
const OVAL_WIDTH = 500
const OVAL_HEIGHT = 80
const STEP_MARGIN = 40
const ARROW_HEIGHT = 30
const SECTION_SPACING = 60
const PADDING_TOP = 80
const PADDING_BOTTOM = 40
const PADDING_LEFT = (CANVAS_WIDTH - OVAL_WIDTH) / 2

export async function generateWorkflowDiagram(input: DiagramInput): Promise<Buffer> {
  const manualSectionHeight = input.manualSteps.length * OVAL_HEIGHT + (input.manualSteps.length - 1) * STEP_MARGIN
  const automationSectionHeight =
    input.automationSteps.length * OVAL_HEIGHT + (input.automationSteps.length - 1) * STEP_MARGIN
  const sectionLabelsHeight = 40 * 2 // Section headers
  const canvasHeight =
    PADDING_TOP + sectionLabelsHeight + manualSectionHeight + SECTION_SPACING + automationSectionHeight + PADDING_BOTTOM

  const canvas = createCanvas(CANVAS_WIDTH, canvasHeight, "image")
  const ctx = canvas.getContext("2d")

  // White background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, CANVAS_WIDTH, canvasHeight)

  // Draw title
  ctx.fillStyle = "#000000"
  ctx.font = "bold 24px Arial"
  ctx.textAlign = "center"
  ctx.fillText(input.title, CANVAS_WIDTH / 2, 40)

  let currentY = PADDING_TOP

  ctx.fillStyle = "#1a56db"
  ctx.font = "bold 18px Arial"
  ctx.textAlign = "left"
  ctx.fillText("Manual Steps", 50, currentY)
  currentY += 40

  input.manualSteps.forEach((step, index) => {
    drawOval(ctx, PADDING_LEFT, currentY, OVAL_WIDTH, OVAL_HEIGHT, step, "#ffffff")
    currentY += OVAL_HEIGHT

    if (index < input.manualSteps.length - 1) {
      drawArrow(ctx, CANVAS_WIDTH / 2, currentY, STEP_MARGIN)
      currentY += STEP_MARGIN
    }
  })

  currentY += SECTION_SPACING

  ctx.fillStyle = "#047857"
  ctx.font = "bold 18px Arial"
  ctx.textAlign = "left"
  ctx.fillText("Automation Steps", 50, currentY)
  currentY += 40

  input.automationSteps.forEach((step, index) => {
    drawOval(ctx, PADDING_LEFT, currentY, OVAL_WIDTH, OVAL_HEIGHT, step, "#f0fdf4")
    currentY += OVAL_HEIGHT

    if (index < input.automationSteps.length - 1) {
      drawArrow(ctx, CANVAS_WIDTH / 2, currentY, STEP_MARGIN)
      currentY += STEP_MARGIN
    }
  })

  return Buffer.from(canvas.toDataURL().split(",")[1], "base64")
}

function drawOval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  fillColor: string,
) {
  const centerX = x + width / 2
  const centerY = y + height / 2
  const radiusX = width / 2
  const radiusY = height / 2

  // Draw oval shape
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = "#333333"
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw step text
  ctx.fillStyle = "#000000"
  ctx.font = "14px Arial"
  ctx.textAlign = "center"

  // Wrap text if too long
  const maxWidth = width - 40
  const words = text.split(" ")
  let line = ""
  const lines: string[] = []

  for (const word of words) {
    const testLine = line + word + " "
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && line !== "") {
      lines.push(line.trim())
      line = word + " "
    } else {
      line = testLine
    }
  }

  if (line.trim() !== "") {
    lines.push(line.trim())
  }

  // Center text vertically
  const lineHeight = 18
  const totalTextHeight = lines.length * lineHeight
  let textY = centerY - totalTextHeight / 2 + lineHeight / 2

  lines.forEach((line) => {
    ctx.fillText(line, centerX, textY)
    textY += lineHeight
  })
}

function drawArrow(ctx: CanvasRenderingContext2D, centerX: number, y: number, height: number) {
  ctx.strokeStyle = "#333333"
  ctx.fillStyle = "#333333"
  ctx.lineWidth = 2

  // Draw vertical line
  ctx.beginPath()
  ctx.moveTo(centerX, y)
  ctx.lineTo(centerX, y + height - 8)
  ctx.stroke()

  // Draw arrowhead
  ctx.beginPath()
  ctx.moveTo(centerX, y + height)
  ctx.lineTo(centerX - 6, y + height - 10)
  ctx.lineTo(centerX + 6, y + height - 10)
  ctx.closePath()
  ctx.fill()
}
