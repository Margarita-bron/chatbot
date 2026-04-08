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

    const filename = file.originalname;
    const contentType = file.mimetype;
    console.log("req.file:", file);
    const { data, error } = await supabase.storage
      .from("files")
      .upload(filename, file.buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(data.path);

    res.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
export default router;
