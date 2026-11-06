import type { ResumeDoc } from "@/lib/types";

export async function downloadResumePdf(node: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    windowWidth: node.scrollWidth,
  });
  const pageWidth = 210;
  const pageHeight = 297;
  const sliceHeight = Math.floor(canvas.width * (pageHeight / pageWidth));
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let offset = 0;
  let page = 0;

  while (offset < canvas.height) {
    const height = Math.min(sliceHeight, canvas.height - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = height;
    const context = slice.getContext("2d");
    if (!context) break;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(canvas, 0, offset, canvas.width, height, 0, 0, canvas.width, height);
    if (page > 0) pdf.addPage();
    const drawHeight = (height / canvas.width) * pageWidth;
    pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageWidth, drawHeight);
    offset += sliceHeight;
    page += 1;
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
