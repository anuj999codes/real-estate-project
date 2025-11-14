'use client';
import Link from 'next/link';

export default function PropertyCard({ property, onDelete }) {
  const price = property.price ? `₹${Number(property.price).toLocaleString()}` : '—';
  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, overflow:'hidden', background:'#fff' }}>
      <div style={{height:160, overflow:'hidden'}}>
        <img src={property.main_image || '/placeholder.jpg'} style={{width:'100%',height:160,objectFit:'cover'}}/>
      </div>

      <div style={{padding:12}}>
        <h3 style={{margin:'0 0 6px 0'}}>{property.project_name}</h3>
        <p style={{margin:0,color:'#666'}}>{property.location}</p>
        <p style={{margin:'8px 0', fontWeight:700}}>{price}</p>

        <div style={{display:'flex', gap:8}}>
          {/* Link text/button: no nested <a> */}
          <Link href={`/property/${property.id}`}>
            <button style={{ padding:'6px 10px', background:'#0070f3', color:'#fff', border:0, borderRadius:6, cursor:'pointer' }}>
              View
            </button>
          </Link>

          <Link href={`/admin/edit/${property.id}`}>
            <button style={{ padding:'6px 10px', background:'#efefef', border:0, borderRadius:6, cursor:'pointer' }}>
              Edit
            </button>
          </Link>

          <button onClick={()=>onDelete && onDelete(property.id)} style={{ padding:'6px 10px', background:'#fff', border:'1px solid #f3dede', borderRadius:6, cursor:'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
