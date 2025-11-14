"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "../components/PropertyCard";
import { fetchProperties, deleteProperty } from "../lib/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchProperties();
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteProperty(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Properties</h1>

        {/* Link without inner <a> — apply className or use a button */}
        <div>
          <Link href="/admin">
            <button style={{ padding: "8px 10px", borderRadius: 6 }}>
              Admin
            </button>
          </Link>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} onDelete={onDelete} showAdmin={false}/>
        ))}
      </div>
      {!loading && items.length === 0 && (
        <p>No properties yet — go to Admin to add.</p>
      )}
    </main>
  );
}
