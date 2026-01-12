import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel } from "docx"

export interface DocxInput {
  title: string
  diagramBuffer: Buffer
}

export async function generateDocx(input: DocxInput): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: input.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
            children: [
              new TextRun({
                text: "Process Flow Diagram",
                bold: false,
                size: 24,
                color: "666666",
              }),
            ],
          }),

          // Diagram image
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
            children: [
              new ImageRun({
                data: input.diagramBuffer,
                transformation: {
                  width: 600,
                  height: Math.floor((input.diagramBuffer.length / 1000) * 0.5), // Approximate height
                },
              }),
            ],
          }),

          // Footer text
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 400,
            },
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()}`,
                size: 18,
                color: "999999",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  })

  return await Packer.toBuffer(doc)
}
