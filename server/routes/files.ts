import express from "express";
import { supabase } from "../supabase/supabase";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { file, filename, contentType } = req.body;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(filename, file, { contentType });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(data.path);

  res.json({ url: publicUrlData.publicUrl });
});

export default router;
