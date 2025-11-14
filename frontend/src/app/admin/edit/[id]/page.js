'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPropertyById, updateProperty } from '../../../../lib/api';
import CloudinaryUpload from '../../../../components/CloudinaryUpload';
import Link from 'next/link';

export default function EditPropertyPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  function setVal(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetchPropertyById(id);
      const data = res.data;

      setForm({
        ...data,
        gallery_images_text: Array.isArray(data.gallery_images)
          ? data.gallery_images.join(', ')
          : '',
      });
    })();
  }, [id]);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      await updateProperty(id, {
        project_name: form.project_name,
        builder_name: form.builder_name,
        location: form.location,
        price: Number(form.price),
        main_image: form.main_image,
        gallery_images: form.gallery_images_text
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        description: form.description,
        highlights: form.highlights,
      });

      router.push('/admin');
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Property #{id}
            </h1>
            <p className="text-sm text-gray-600">
              Update fields and save changes.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-sm text-gray-700 hover:underline"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={submit}>
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name *</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.project_name}
                onChange={(e) => setVal('project_name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Builder Name</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.builder_name}
                onChange={(e) => setVal('builder_name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.location}
                  onChange={(e) => setVal('location', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.price}
                  onChange={(e) => setVal('price', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                value={form.description}
                onChange={(e) => setVal('description', e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Image</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.main_image}
                onChange={(e) => setVal('main_image', e.target.value)}
              />

              <CloudinaryUpload
                onUploaded={(url) => setVal('main_image', url)}
              />

              {form.main_image && (
                <img
                  src={form.main_image}
                  className="w-full h-40 object-cover rounded-md mt-2 border"
                />
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gallery Images
              </label>
              <p className="text-xs text-gray-500">Comma-separated URLs</p>

              <input
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.gallery_images_text}
                onChange={(e) => setVal('gallery_images_text', e.target.value)}
              />

              <CloudinaryUpload
                onUploaded={(url) =>
                  setVal(
                    'gallery_images_text',
                    form.gallery_images_text
                      ? form.gallery_images_text + ', ' + url
                      : url
                  )
                }
              />

              {/* Gallery preview */}
              {form.gallery_images_text && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.gallery_images_text
                    .split(',')
                    .map((g, i) => (
                      <img
                        key={i}
                        src={g.trim()}
                        className="w-full h-20 object-cover rounded-md border"
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-2 rounded-md text-white text-sm font-medium ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="w-full py-2 rounded-md text-sm font-medium border bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
