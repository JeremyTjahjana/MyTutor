import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const contractTemplatePath = path.join(
  process.cwd(),
  "features",
  "register-tutor",
  "assets",
  "contract-template.pdf",
);

export async function GET() {
  try {
    const pdf = await readFile(contractTemplatePath);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Disposition":
          'attachment; filename="template-kontrak-tutor-mytutor-draft.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "Template kontrak belum tersedia. Generate PDF dan simpan ke features/register-tutor/assets/contract-template.pdf.",
      },
      { status: 404 },
    );
  }
}
