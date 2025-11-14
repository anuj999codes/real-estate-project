'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fetchProperties, deleteProperty } from '../../lib/api';

export default function AdminPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qName, setQName] = useState('');
  const [qLocation, setQLocation] = useState('');
  const [sort, setSort] = useState('newest'); // newest | price_asc | price_desc
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProperties()
      .then((res) => { if (mounted) setList(res.data || []); })
      .catch((err) => { console.error(err); if (mounted) setError(err.message || 'Failed to load'); })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const processed = useMemo(() => {
    let arr = Array.isArray(list) ? [...list] : [];

    if (qName.trim()) {
      const t = qName.trim().toLowerCase();
      arr = arr.filter((p) => (p.project_name || '').toLowerCase().includes(t));
    }
    if (qLocation.trim()) {
      const t = qLocation.trim().toLowerCase();
      arr = arr.filter((p) => (p.location || '').toLowerCase().includes(t));
    }

    if (sort === 'price_asc') arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sort === 'price_desc') arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    return arr;
  }, [list, qName, qLocation, sort]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  const pageItems = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    const prev = list;
    setList((s) => s.filter((p) => p.id !== id));
    try {
      await deleteProperty(id);
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown'));
      setList(prev);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin — Properties</h1>
            <p className="mt-1 text-sm text-gray-500">Manage property listings — add, edit and delete.</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Link href="/" className="hidden sm:inline text-sm text-gray-700 hover:underline">Public</Link>
            <Link href="/admin/new">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Add New
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <input
                type="text"
                value={qName}
                onChange={(e) => { setQName(e.target.value); setPage(1); }}
                placeholder="Search by project name..."
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <input
                type="text"
                value={qLocation}
                onChange={(e) => { setQLocation(e.target.value); setPage(1); }}
                placeholder="Filter by location..."
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_desc">Price (high → low)</option>
                <option value="price_asc">Price (low → high)</option>
              </select>
            </div>

            <div className="sm:col-span-2 text-sm text-gray-600 text-right">
              {processed.length} result{processed.length !== 1 && 's'}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="text-gray-600">Loading properties...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-red-600">{error}</div>
          ) : processed.length === 0 ? (
            <div className="p-6 text-gray-600">
              No properties yet. <Link href="/admin/new" className="text-blue-600 underline">Add new</Link>
            </div>
          ) : (
            <table className="min-w-full table-auto divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {pageItems.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.project_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">₹{Number(p.price || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/property/${p.id}`}>
                          <button className="px-3 py-1 rounded-md text-sm bg-white border border-gray-200 hover:bg-gray-50">View</button>
                        </Link>

                        <Link href={`/admin/edit/${p.id}`}>
                          <button className="px-3 py-1 rounded-md text-sm bg-white border border-gray-200 hover:bg-gray-50">Edit</button>
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {processed.length > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, processed.length)} of {processed.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
              >
                First
              </button>

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
              >
                Prev
              </button>

              <div className="px-3 py-1 text-sm">Page {page} / {totalPages}</div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
              >
                Next
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
