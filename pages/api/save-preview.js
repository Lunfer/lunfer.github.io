import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { dataUrl } = req.body;
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(base64, "base64");
    const dest = path.join(process.cwd(), "public", "images", "pulseclub-preview.jpg");
    fs.writeFileSync(dest, buf);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };
