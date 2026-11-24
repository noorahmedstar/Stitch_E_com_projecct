import { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const CURRENT_YEAR = new Date().getFullYear()

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty', 'Others']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'stock_asc', label: 'Stock: Low to High' },
]

const AllProducts = () => {
  const { handleGetSellerProduct, handleDeleteProduct, loading, error } = useProduct()
  const products = useSelector((state) => state.product.sellerProduct)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    handleGetSellerProduct()
  }, [])

  /* ── derived list ── */
  const filtered = (products ?? [])
    .filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || p.category === category
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return (a.price ?? 0) - (b.price ?? 0)
      if (sort === 'price_desc') return (b.price ?? 0) - (a.price ?? 0)
      if (sort === 'stock_asc') return (a.stock ?? 0) - (b.stock ?? 0)
      return 0 // newest: keep API order
    })

  const totalValue = (products ?? []).reduce((acc, p) => acc + (p.price ?? 0) * (p.stock ?? 0), 0)

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    const ok = await handleDeleteProduct(id)
    if (ok) {
      setSuccessMessage('Product deleted.')
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-700">

      {/* ── Header ── */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Stiich</span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400 ml-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-600">Seller Dashboard</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/products/create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage, monitor, and update your active catalog listings.</p>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
              label: 'Total Products',
              value: products?.length ?? 0,
              sub: '+12% this month',
              subColor: 'text-emerald-600',
            },
            {
              icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
              label: 'Active Listings',
              value: products?.filter((p) => (p.stock ?? 0) > 0).length ?? 0,
              sub: `${(products?.filter((p) => (p.stock ?? 0) === 0).length ?? 0)} out of stock`,
              subColor: 'text-slate-400',
            },
            {
              icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              label: 'Total Inventory Value',
              value: `₹${totalValue.toLocaleString('en-IN')}`,
              sub: '+8.4% vs last week',
              subColor: 'text-emerald-600',
            },
          ].map(({ icon, label, value, sub, subColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
                <p className={`text-xs mt-0.5 ${subColor}`}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/90 p-4 animate-pulse">
                <div className="aspect-square rounded-2xl bg-slate-100 mb-4" />
                <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-9 bg-slate-100 rounded-xl flex-1" />
                  <div className="h-9 bg-rose-50 rounded-xl w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 mb-5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No products yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              {search || category !== 'All'
                ? 'No products match your current filters.'
                : 'Start by listing your first product to reach thousands of buyers.'}
            </p>
            {!search && category === 'All' && (
              <button
                onClick={() => navigate('/products/create')}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all"
              >
                Create Product
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ── Product Grid ── */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 hover:shadow-lg transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="aspect-square rounded-2xl bg-slate-100/90 border border-slate-100 flex items-center justify-center mb-4 overflow-hidden relative">
                    {(product.images?.[0]?.url ?? product.images?.[0]) ? (
                      <img
                        src={product.images[0].url ?? product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}

                    {/* Stock pill overlay */}
                    <div className="absolute top-2.5 right-2.5">
                      {(product.stock ?? 0) === 0 ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : (product.stock ?? 0) <= 5 ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 mb-4">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      {product.category && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {product.category}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{product.stock ?? 0} in stock</span>
                    </div>
                    <p className="text-xl font-semibold text-indigo-600">
                      ₹{Number(product.price ?? 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium text-sm transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Count */}
            <p className="mt-6 text-xs text-slate-400 text-center">
              Showing {filtered.length} of {products?.length ?? 0} products
            </p>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-white/70 border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {CURRENT_YEAR} Stiich Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-800 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-800 transition-colors">Terms</a>
            <a href="#security" className="hover:text-slate-800 transition-colors">Security</a>
            <a href="#help" className="hover:text-slate-800 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AllProducts
