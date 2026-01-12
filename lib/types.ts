export interface WorkflowInput {
  title: string
  manualSteps: string[]
  automationSteps: string[]
}

export interface DiagramConfig {
  width: number
  boxWidth: number
  boxHeight: number
  boxMargin: number
  arrowHeight: number
  paddingTop: number
  paddingBottom: number
}
