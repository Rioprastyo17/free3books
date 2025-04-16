import { readdirSync } from "fs";
import path from "path";

export async function GET() {
  const ebooksDirectory = path.join(process.cwd(), "public/data"); // Akses folder 'public/data'
  const files = readdirSync(ebooksDirectory); // Membaca daftar file dalam folder

  // Filter hanya file dengan ekstensi .pdf
  const ebooks = files
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => ({
      title: file.replace(".pdf", ""), // Menghilangkan ekstensi .pdf
      url: `/data/${file}`, // Path untuk diakses di browser
    }));

  return Response.json(ebooks);
}
