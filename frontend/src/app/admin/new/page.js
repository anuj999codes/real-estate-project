"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createProperty } from "../../../lib/api";
import { useRouter } from "next/navigation";
import CloudinaryUpload from "../../../components/CloudinaryUpload";

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    project_name: "",
    builder_name: "",
    location: "",
    price: "",
    main_image: "",
    gallery_images_text: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (form.price && isNaN(Number(form.price))) {
      setErrors((e) => ({ ...e, price: "Price must be a number" }));
    } else {
      setErrors((e) => ({ ...e, price: undefined }));
    }
  }, [form.price]);

  function setVal(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function galleryArray() {
    return form.gallery_images_text
      ? form.gallery_images_text
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  }

  async function submit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.project_name) newErrors.project_name = "Project name is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.price) newErrors.price = "Price is required";
    if (form.price && isNaN(Number(form.price)))
      newErrors.price = "Price must be a number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const payload = {
      project_name: form.project_name,
      builder_name: form.builder_name,
      location: form.location,
      price: Number(form.price),
      main_image: form.main_image,
      gallery_images: galleryArray(),
      description: form.description,
    };

    try {
      setSaving(true);
      await createProperty(payload);
      router.push("/admin");
    } catch (err) {
      alert("Create failed: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a listing that will appear on the public site.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-sm text-gray-700 hover:underline"
            >
              ← Back to admin
            </Link>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left column: form fields */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project name *
                </label>
                <input
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.project_name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="e.g. Sky Towers"
                  value={form.project_name}
                  onChange={(e) => setVal("project_name", e.target.value)}
                />
                {errors.project_name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.project_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Builder
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Builder name"
                  value={form.builder_name}
                  onChange={(e) => setVal("builder_name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="City, area"
                  value={form.location}
                  onChange={(e) => setVal("location", e.target.value)}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-1 relative">
                  <input
                    className={`block w-full rounded-md border px-3 py-2 pr-20 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.price
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                    placeholder="Numeric value"
                    value={form.price}
                    onChange={(e) => setVal("price", e.target.value)}
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                    INR
                  </span>
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Enter full description / highlights"
                value={form.description}
                onChange={(e) => setVal("description", e.target.value)}
              />
            </div>
          </div>

          {/* Right column: images + submit */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main image
              </label>
              <div className="mt-2 flex flex-col gap-2">
                <input
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste image URL or upload"
                  value={form.main_image}
                  onChange={(e) => setVal("main_image", e.target.value)}
                />
                <CloudinaryUpload
                  folder="properties"
                  onUploaded={(url) => setVal("main_image", url)}
                />
                {form.main_image && (
                  <img
                    src={form.main_image}
                    alt="main"
                    className="mt-2 w-full h-40 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gallery images
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated URLs or upload multiple times to append.
              </p>
              <input
                className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..., https://..."
                value={form.gallery_images_text}
                onChange={(e) => setVal("gallery_images_text", e.target.value)}
              />
              <CloudinaryUpload
                onUploaded={(url) =>
                  setVal(
                    "gallery_images_text",
                    (form.gallery_images_text
                      ? form.gallery_images_text + ", "
                      : "") + url
                  )
                }
              />
              {galleryArray().length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {galleryArray().map((g, i) => (
                    <img
                      key={i}
                      src={g}
                      alt={`g-${i}`}
                      className="w-full h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                onClick={submit}
                disabled={saving}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                  saving
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Create Property"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Tip: Use image uploads for better results. Uploaded images are
              stored as URLs.
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
