"use client";
import { useState } from "react";

export default function CloudinaryUpload({ onUploaded }) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!preset || !cloud) {
      alert(
        "Cloudinary not configured in .env.local — paste image URL instead."
      );
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      if (json.secure_url) onUploaded(json.secure_url);
      else throw new Error("Upload failed");
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="file" accept="image/*" onChange={handleFile} />
      {loading && <span>Uploading...</span>}
    </div>
  );
}
