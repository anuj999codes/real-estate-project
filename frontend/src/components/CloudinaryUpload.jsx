'use client';
import { useState } from 'react';

export default function CloudinaryUpload({ onUploaded, folder }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setProgress(0);

    try {
      // 1) get signature from backend
      const sigRes = await fetch(`${API_BASE}/uploads/signature`);
      if (!sigRes.ok) throw new Error('signature fetch failed');
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

      // 2) prepare form
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', timestamp);
      fd.append('signature', signature);
      if (folder) fd.append('folder', folder);

      // 3) upload with XHR for progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const resp = JSON.parse(xhr.responseText);
            if (resp.secure_url) {
              onUploaded && onUploaded(resp.secure_url);
              resolve(resp);
            } else reject(new Error('no secure_url in response'));
          } else reject(new Error('Upload failed status ' + xhr.status));
        };
        xhr.onerror = () => reject(new Error('Upload network error'));
        xhr.send(fd);
      });

    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.message || err));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <label className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md cursor-pointer text-sm">
        {loading ? `Uploading ${progress}%` : 'Upload'}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
      {loading && <span className="text-xs text-gray-600">Progress: {progress}%</span>}
    </div>
  );
}
