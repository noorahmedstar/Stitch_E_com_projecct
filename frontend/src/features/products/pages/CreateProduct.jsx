import { useState, useRef } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useNavigate } from 'react-router'

const CURRENT_YEAR = new Date().getFullYear()

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Books',
  'Sports',
  'Beauty',
  'Others',
]

const CreateProducts = () => {
  const { handleCreateProduct, loading, error } = useProduct()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
  })

  const [images, setImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiles = (files) => {
    const accepted = Array.from(files).filter((f) =>
      ['image/png', 'image/jpeg', 'image/jpg'].includes(f.type)
    )
    setImages((prev) => [...prev, ...accepted].slice(0, 5))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')

    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('category', formData.category)
    fd.append('description', formData.description)
    fd.append('price', formData.price)
    fd.append('stock', formData.stock)
    images.forEach((img) => fd.append('images', img))

    const result = await handleCreateProduct(fd)
    if (result) {
      setSuccessMessage('Product listed successfully! Redirecting…')
      setTimeout(() => navigate('/products'), 1500)
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
              <span>Seller Dashboard</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-600">New Product</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <a
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All Products
            </a>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 flex items-start justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── Left Feature Panel ── */}
          <section className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl bg-gradient-to-b from-white to-slate-100/90 border border-slate-200/80 p-10 relative overflow-hidden shadow-xs min-h-[560px]">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider">Product Studio</span>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  List your product, reach thousands.
                </h1>
                <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                  Publish your products to the Stiich marketplace and connect with verified buyers across the country instantly.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                    title: 'Instant listing',
                    desc: 'Publish directly to the marketplace catalog in seconds.',
                  },
                  {
                    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                    title: 'Smart analytics',
                    desc: 'Track views, conversion rates, and buyer demand in real time.',
                  },
                  {
                    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                    title: 'Verified store badge',
                    desc: 'Build buyer trust with authenticated seller credentials.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-slate-200/60 shadow-xs backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-8 border-t border-slate-200/70 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Marketplace Catalog — Live &amp; Active</span>
            </div>
          </section>

          {/* ── Right Form Card ── */}
          <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 flex flex-col justify-center">

            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">List a New Product</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  Seller Dashboard
                </span>
              </div>
              <p className="text-sm text-slate-500">Fill in the details below to list your product on Stiich.</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success banner */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Mechanical Keyboard"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product — features, materials, dimensions…"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Price + Stock row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Price (₹)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none font-semibold text-sm">₹</div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Stock Quantity
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="e.g. 50"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Images
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    dragOver
                      ? 'border-indigo-400 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">Drag &amp; drop or click to upload</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 10MB · Max 5 images</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>

                {/* Image previews */}
                {images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>List Product</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pt-1">
                By listing, you agree to our{' '}
                <a href="#terms" className="text-indigo-600 hover:text-indigo-700 underline">Seller Terms</a>{' '}
                and{' '}
                <a href="#policy" className="text-indigo-600 hover:text-indigo-700 underline">Listing Policy</a>.
              </p>
            </form>
          </section>

        </div>
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

export default CreateProducts
