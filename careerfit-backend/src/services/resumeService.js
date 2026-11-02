import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const MAX_EXTRACTED_CHARS = 20000;

export async function extractResumeText(file) {
  const { buffer, originalname } = file;
  const extension = originalname.split(".").pop()?.toLowerCase();
  let text = "";

  if (extension === "pdf") {
    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
      throw new Error("The uploaded file is not a valid PDF.");
    }

    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      text = result.text || "";
    } finally {
      await parser.destroy();
    }
  } else if (extension === "docx") {
    // DOCX is a ZIP-based Office format. This is a basic signature check.
    if (buffer.subarray(0, 2).toString() !== "PK") {
      throw new Error("The uploaded file is not a valid DOCX document.");
    }

    const result = await mammoth.extractRawText({ buffer });
    text = result.value || "";
  } else if (extension === "doc") {
    throw new Error(
      "Legacy .doc files are not supported yet. Please save the file as PDF or DOCX."
    );
  } else {
    throw new Error("Unsupported file format. Upload a PDF or DOCX file.");
  }

  text = text.trim();

  if (text.length < 50) {
    throw new Error(
      "Very little readable text was found. The file may be scanned or image-only; OCR is not included yet."
    );
  }

  return text.slice(0, MAX_EXTRACTED_CHARS);
}
