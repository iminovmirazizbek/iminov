const API_ORIGIN = 'https://dokonb.up.railway.app'
const API_BASE = import.meta.env.VITE_API_URL || `${API_ORIGIN}/api`

const demoProducts = [
  { id: 1, nomi: 'Samsung Galaxy S24', kategoriya: 'telefon', puli: 8999000, reyting: 4.8, izohlar_soni: 124, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85' },
  { id: 2, nomi: 'Apple iPhone 15', kategoriya: 'telefon', puli: 10999000, reyting: 4.9, izohlar_soni: 98, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=85' },
  { id: 3, nomi: 'MacBook Air M3', kategoriya: 'noutbuk', puli: 15999000, reyting: 4.9, izohlar_soni: 56, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85' },
  { id: 4, nomi: 'Sony WH-1000XM5', kategoriya: 'aksessuar', puli: 3999000, reyting: 4.7, izohlar_soni: 41, image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85' },
]

function normalizeProduct(product) {
  if (!product) return product

  const image = product.image_url || product.img_url || product.image || product.rasm_url || product.rasm || null
  const normalized = {
    ...product,
    nomi: product.nomi ?? product.name ?? product.title ?? 'Mahsulot',
    puli: product.puli ?? product.price ?? product.narx ?? product.cost ?? 0,
    kategoriya: product.kategoriya ?? product.category ?? product.slug ?? 'telefon',
    oyiga_qancha: product.oyiga_qancha ?? product.monthly_payment ?? product.oyiga ?? product.payment ?? null,
    necha_oyga: product.necha_oyga ?? product.necha_oy ?? product.installments ?? product.oylar_soni ?? 12,
    reyting: product.reyting ?? product.rating ?? 4.8,
    izohlar_soni: product.izohlar_soni ?? product.reviews_count ?? product.comment_count ?? 0,
    tavsif: product.tavsif ?? product.description ?? product.izoh ?? '',
    mavjud: product.mavjud ?? product.available ?? true,
    image_url: image && image.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, API_ORIGIN).replace(/^\/(?!\/)/, `${API_ORIGIN}/`),
  }

  if (normalized.oyiga_qancha !== null && normalized.oyiga_qancha !== undefined && normalized.necha_oyga === 12 && Number(normalized.oyiga_qancha) > 0) {
    normalized.necha_oyga = Number(normalized.necha_oyga) || 12
  }

  return normalized
}

function authHeaders(extra = {}) {
  const token = localStorage.getItem('shopuz-admin-token') || localStorage.getItem('shopuz-token')
  return token ? { Authorization: `Token ${token}`, ...extra } : extra
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || `API error: ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

async function formRequest(path, formData, method='POST') {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: formData,
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || `API error: ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

export const api = {
  getProducts: () => request('/tovar/').then((products) => products.map(normalizeProduct)).catch(() => demoProducts),
  getProduct: (id) => request(`/tovar/${id}/`).then(normalizeProduct).catch(() => demoProducts.find((product) => String(product.id) === String(id)) || null),
  getTop: () => request('/top/'),

  register: (username, password, password2, email) => request('/register/', {
    method: 'POST',
    body: JSON.stringify({ username, password, password2, email }),
  }),
  login: (username, password) => request('/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  me: () => request('/me/'),

  adminLogin: (username, password) => request('/admin/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  adminMe: () => request('/admin/me/'),
  adminUsers: () => request('/admin/users/'),
  deleteUser: (id) => request(`/admin/users/${id}/`, { method: 'DELETE' }),
  adminProducts: () => request('/admin/tovar/'),
  addProduct: (form) => formRequest('/admin/tovar/', form),
  updateProduct: (id, form) => formRequest(`/admin/tovar/${id}/`, form, 'PATCH'),
  deleteProduct: (id) => request(`/admin/tovar/${id}/`, { method: 'DELETE' }),

  adminBanners: () => request('/admin/top/'),
  addBanner: (form) => formRequest('/admin/top/', form),
  updateBanner: (id, form) => formRequest(`/admin/top/${id}/`, form, 'PATCH'),
  deleteBanner: (id) => request(`/admin/top/${id}/`, { method: 'DELETE' }),
}
