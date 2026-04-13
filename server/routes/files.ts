import express from "express";
import { supabase } from "../supabase/supabase";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop()?.toLowerCase() || "file";
    const filename = `${timestamp}_${file.size}.${ext}`;

    console.log("req.file:", file);

    const { data, error } = await supabase.storage
      .from("chatbot")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    console.log(
      'supabase.storage.from("files")upload(filename, file.buffe',
      data,
    );
    if (error || !data) {
      return res.status(400).json({ error: error.message });
    }
    const { data: publicUrlData } = supabase.storage
      .from("chatbot")
      .getPublicUrl(data.path);

    res.json({
      url: publicUrlData.publicUrl,
      mimeType: file.mimetype,
      size: file.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
export default router;
