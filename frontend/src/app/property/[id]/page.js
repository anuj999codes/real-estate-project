'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchPropertyById } from '../../../lib/api';

export default function PropertyDetailClient() {
  const params = useParams(); // hook for client components
  const id = params?.id;
  const [prop, setProp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchPropertyById(id);
        if (mounted) setProp(res.data || null);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!prop) return <p style={{ padding: 20 }}>Not found</p>;

  return (
    <main style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <Link href="/"><button style={{ marginBottom: 12 }}>← Back</button></Link>

      <h1>{prop.project_name}</h1>
      <p style={{ color: '#666' }}>{prop.location} • {prop.builder_name || '—'}</p>
      <h2>₹{Number(prop.price).toLocaleString()}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginTop: 16 }}>
        <div>
          <img src={prop.main_image || '/placeholder.jpg'} style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 8 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
            {Array.isArray(prop.gallery_images) && prop.gallery_images.map((g,i)=>(
              <img key={i} src={g} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />
            ))}
          </div>
        </div>

        <aside style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <h3>Details</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{prop.description || 'No description'}</p>
        </aside>
      </div>
    </main>
  );
}
