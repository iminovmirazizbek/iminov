<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  LayoutDashboard, Package, LayoutGrid, ClipboardList, Users, Percent, Settings,
  LogOut, Menu, X, Search, Plus, Pencil, Trash2, ShieldCheck, ImageOff,
  Smartphone, Laptop, Headphones, WashingMachine, Shirt, Dumbbell, Sparkles,
} from 'lucide-vue-next'
import { api } from '../services/api'

const router = useRouter()

const CATEGORIES = [
  { key: 'telefon', label: 'Telefonlar', icon: Smartphone },
  { key: 'noutbuk', label: 'Noutbuklar', icon: Laptop },
  { key: 'aksessuar', label: 'Aksessuarlar', icon: Headphones },
  { key: 'texnika', label: 'Maishiy texnika', icon: WashingMachine },
  { key: 'kiyim', label: 'Kiyim', icon: Shirt },
  { key: 'sport', label: 'Sport', icon: Dumbbell },
  { key: 'gozallik', label: "Go'zallik", icon: Sparkles },
]

const navItems = [
  { key: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { key: 'products', label: 'Mahsulotlar', icon: Package },
  { key: 'categories', label: 'Kategoriyalar', icon: LayoutGrid },
  { key: 'orders', label: 'Buyurtmalar', icon: ClipboardList },
  { key: 'users', label: 'Foydalanuvchilar', icon: Users },
  { key: 'promo', label: 'Aksiyalar', icon: Percent },
  { key: 'settings', label: 'Sozlamalar', icon: Settings },
]
const bottomNavKeys = ['dashboard', 'products', 'orders', 'settings']
const bottomNavItems = computed(() => navItems.filter(n => bottomNavKeys.includes(n.key)))
const pageTitles = Object.fromEntries(navItems.map(n => [n.key, n.label]))

/* ---------- holat ---------- */
const tab = ref('dashboard')
const mobileMenu = ref(false)
const loading = ref(true)
const error = ref('')

const products = ref([])
const users = ref([])
const banners = ref([])

function selectTab(key) { tab.value = key; mobileMenu.value = false }

function buildFormData(data, imageFile) {
  const fd = new FormData()
  Object.entries(data).forEach(([key, val]) => {
    if (val !== '' && val !== null && val !== undefined) fd.append(key, val)
  })
  if (imageFile) fd.append('img', imageFile)
  return fd
}

/* ---------- statistika ---------- */
const adminName = computed(() => localStorage.getItem('shopuz-admin-name') || 'Admin')
const totalProducts = computed(() => products.value.length)
const activeProducts = computed(() => products.value.filter(p => p.mavjud !== false).length)
const totalUsers = computed(() => users.value.length)
const totalBanners = computed(() => banners.value.length)

const categoryStats = computed(() => CATEGORIES.map(c => ({
  ...c, count: products.value.filter(p => p.kategoriya === c.key).length,
})))
const maxCategoryCount = computed(() => Math.max(1, ...categoryStats.value.map(c => c.count)))
const recentProducts = computed(() => products.value.slice(0, 5))

/* ---------- mahsulotlar ---------- */
const search = ref('')
const categoryFilter = ref('')
const filteredProducts = computed(() => products.value.filter(p => {
  const matchSearch = !search.value || (p.nomi || '').toLowerCase().includes(search.value.toLowerCase())
  const matchCategory = !categoryFilter.value || p.kategoriya === categoryFilter.value
  return matchSearch && matchCategory
}))

const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const image = ref(null)
const form = ref({
  nomi: '', kategoriya: 'telefon', puli: '', eski_narx: '', oyiga_qancha: '',
  necha_oyga: '', reyting: '4.8', tavsif: '', mavjud: true,
})

function resetForm() {
  form.value = { nomi: '', kategoriya: 'telefon', puli: '', eski_narx: '', oyiga_qancha: '', necha_oyga: '', reyting: '4.8', tavsif: '', mavjud: true }
  image.value = null
  editingId.value = null
  showForm.value = false
}
function openAdd() { resetForm(); showForm.value = true }
function editProduct(p) {
  editingId.value = p.id
  form.value = {
    nomi: p.nomi || '', kategoriya: p.kategoriya || 'telefon', puli: p.puli || '',
    eski_narx: p.eski_narx || '', oyiga_qancha: p.oyiga_qancha || '',
    necha_oyga: p.necha_oyga || '', reyting: p.reyting || '4.8',
    tavsif: p.tavsif || '', mavjud: p.mavjud !== false,
  }
  image.value = null
  showForm.value = true
}
function chooseImage(e) { image.value = e.target.files?.[0] || null }

async function saveProduct() {
  if (!form.value.nomi || !form.value.puli) { error.value = 'Mahsulot nomi va narxini kiriting.'; return }
  saving.value = true; error.value = ''
  try {
    const fd = buildFormData(form.value, image.value)
    if (editingId.value) await api.updateProduct(editingId.value, fd)
    else await api.addProduct(fd)
    await loadProducts()
    resetForm()
  } catch (e) { error.value = e.message }
  finally { saving.value = false }
}
async function removeProduct(p) {
  if (!confirm(`"${p.nomi}" mahsulotini o'chirasizmi?`)) return
  try { await api.deleteProduct(p.id); await loadProducts() } catch (e) { error.value = e.message }
}
async function loadProducts() { products.value = await api.adminProducts() }

/* ---------- aksiyalar (banner mahsulotlar) ---------- */
const showBannerForm = ref(false)
const editingBannerId = ref(null)
const bannerSaving = ref(false)
const bannerImage = ref(null)
const bannerForm = ref({ nomi: '', puli: '', oyiga_qancha: '', necha_oyga: '' })

function resetBannerForm() {
  bannerForm.value = { nomi: '', puli: '', oyiga_qancha: '', necha_oyga: '' }
  bannerImage.value = null
  editingBannerId.value = null
  showBannerForm.value = false
}
function openAddBanner() { resetBannerForm(); showBannerForm.value = true }
function editBanner(b) {
  editingBannerId.value = b.id
  bannerForm.value = { nomi: b.nomi || '', puli: b.puli || '', oyiga_qancha: b.oyiga_qancha || '', necha_oyga: b.necha_oyga || '' }
  bannerImage.value = null
  showBannerForm.value = true
}
function chooseBannerImage(e) { bannerImage.value = e.target.files?.[0] || null }

async function saveBanner() {
  if (!bannerForm.value.nomi) { error.value = 'Aksiya nomini kiriting.'; return }
  bannerSaving.value = true; error.value = ''
  try {
    const fd = buildFormData(bannerForm.value, bannerImage.value)
    if (editingBannerId.value) await api.updateBanner(editingBannerId.value, fd)
    else await api.addBanner(fd)
    await loadBanners()
    resetBannerForm()
  } catch (e) { error.value = e.message }
  finally { bannerSaving.value = false }
}
async function removeBanner(b) {
  if (!confirm(`"${b.nomi}" aksiyasini o'chirasizmi?`)) return
  try { await api.deleteBanner(b.id); await loadBanners() } catch (e) { error.value = e.message }
}
async function loadBanners() { banners.value = await api.adminBanners() }

/* ---------- foydalanuvchilar ---------- */
const userSearch = ref('')
const filteredUsers = computed(() => users.value.filter(u =>
  !userSearch.value || (u.username || '').toLowerCase().includes(userSearch.value.toLowerCase())
  || (u.email || '').toLowerCase().includes(userSearch.value.toLowerCase())
))
async function loadUsers() { users.value = await api.adminUsers() }
async function removeUser(u) {
  if (!confirm(`${u.username} foydalanuvchisini o'chirasizmi?`)) return
  try { await api.deleteUser(u.id); await loadUsers() } catch (e) { error.value = e.message }
}

/* ---------- kirish / chiqish ---------- */
async function logout() {
  localStorage.removeItem('shopuz-admin-token')
  localStorage.removeItem('shopuz-admin-name')
  router.push('/admin/login')
}
async function load() {
  loading.value = true; error.value = ''
  try { await Promise.all([loadProducts(), loadUsers(), loadBanners()]) }
  catch (e) {
    if (String(e.message).includes('401') || String(e.message).includes('403')) logout()
    else error.value = e.message
  } finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div class="min-h-screen bg-[#0a0a13] text-white lg:flex">

    <!-- ============ DESKTOP SIDEBAR ============ -->
    <aside
      class="hidden lg:flex lg:h-screen lg:w-[260px] lg:shrink-0 lg:flex-col lg:sticky lg:top-0 lg:border-r lg:border-white/8 lg:bg-[#0e0d1c] lg:px-[16px] lg:py-[22px]">
      <div class="flex items-center gap-[10px] px-[6px]">
        <div
          class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#8b5cf6] to-[#5b3df0] font-black">
          S</div>
        <div>
          <p class="text-[16px] font-black leading-none">Shop<span class="text-[#a78bfa]">Uz</span></p>
          <p class="mt-[4px] text-[10px] text-white/40">Admin Panel</p>
        </div>
      </div>
      <nav class="mt-[26px] flex flex-1 flex-col gap-[4px]">
        <button v-for="n in navItems" :key="n.key" @click="selectTab(n.key)"
          :class="tab === n.key ? 'bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'"
          class="flex items-center gap-[11px] rounded-[11px] px-[13px] py-[11px] text-left text-[13px] font-bold transition-colors">
          <component :is="n.icon" :size="17" /> {{ n.label }}
        </button>
      </nav>
      <button @click="logout"
        class="mt-[10px] flex items-center gap-[11px] rounded-[11px] border border-white/8 px-[13px] py-[11px] text-[13px] font-bold text-white/55 hover:border-red-400/25 hover:text-red-300">
        <LogOut :size="17" /> Chiqish
      </button>
    </aside>

    <!-- ============ MOBILE TOPBAR ============ -->
    <header
      class="flex items-center justify-between border-b border-white/8 bg-[#0e0d1c] px-[16px] py-[14px] lg:hidden">
      <div class="flex items-center gap-[9px]">
        <div
          class="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#8b5cf6] to-[#5b3df0] text-[13px] font-black">
          S</div>
        <p class="text-[14px] font-black">Admin Panel</p>
      </div>
      <button @click="mobileMenu = true" class="rounded-[10px] border border-white/10 p-[9px]">
        <Menu :size="18" />
      </button>
    </header>

    <!-- ============ MOBILE DRAWER ============ -->
    <div v-if="mobileMenu" class="fixed inset-0 z-[110] bg-black/70 lg:hidden" @click.self="mobileMenu = false">
      <div class="ml-auto flex h-full w-[78%] max-w-[300px] flex-col bg-[#0e0d1c] px-[16px] py-[20px]">
        <div class="flex items-center justify-between">
          <p class="text-[15px] font-black">Menyu</p><button @click="mobileMenu = false"
            class="rounded-[9px] p-[7px] text-white/60">
            <X :size="19" />
          </button>
        </div>
        <nav class="mt-[18px] flex flex-1 flex-col gap-[4px]">
          <button v-for="n in navItems" :key="n.key" @click="selectTab(n.key)"
            :class="tab === n.key ? 'bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] text-white' : 'text-white/55 hover:bg-white/5'"
            class="flex items-center gap-[11px] rounded-[11px] px-[13px] py-[12px] text-left text-[13px] font-bold">
            <component :is="n.icon" :size="17" /> {{ n.label }}
          </button>
        </nav>
        <button @click="logout"
          class="mt-[10px] flex items-center gap-[11px] rounded-[11px] border border-white/8 px-[13px] py-[12px] text-[13px] font-bold text-red-300">
          <LogOut :size="17" /> Chiqish
        </button>
      </div>
    </div>

    <!-- ============ MAIN ============ -->
    <div class="min-w-0 flex-1">
      <div class="hidden items-center justify-between border-b border-white/8 px-[28px] py-[19px] lg:flex">
        <div>
          <h1 class="text-[19px] font-black">{{ pageTitles[tab] }}</h1>
          <p class="mt-[3px] text-[11px] text-white/40">Xush kelibsiz, {{ adminName }}</p>
        </div>
        <div class="flex items-center gap-[9px] rounded-[11px] border border-white/8 px-[12px] py-[8px]">
          <div
            class="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#8b5cf6]/15 text-[12px] font-black text-[#a78bfa]">
            {{ adminName.charAt(0).toUpperCase() }}</div>
          <span class="text-[12px] font-bold">{{ adminName }}</span>
        </div>
      </div>

      <main class="fade px-[16px] py-[18px] pb-[86px] lg:px-[28px] lg:py-[24px] lg:pb-[24px]">
        <p v-if="error"
          class="mb-[14px] rounded-[10px] border border-red-400/20 bg-red-400/5 p-[10px] text-[11px] text-red-300">
          {{ error }}</p>
        <div v-if="loading" class="py-[90px] text-center text-[13px] text-white/40">Yuklanmoqda...</div>

        <template v-else>

          <!-- ===== DASHBOARD ===== -->
          <section v-if="tab === 'dashboard'" class="fade">
            <div class="grid grid-cols-2 gap-[12px] lg:grid-cols-4">
              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="text-[11px] text-white/45">Jami mahsulotlar</p>
                <p class="mt-[8px] text-[24px] font-black">{{ totalProducts }}</p>
              </div>
              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="text-[11px] text-white/45">Faol mahsulotlar</p>
                <p class="mt-[8px] text-[24px] font-black text-[#a78bfa]">{{ activeProducts }}</p>
              </div>
              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="text-[11px] text-white/45">Foydalanuvchilar</p>
                <p class="mt-[8px] text-[24px] font-black">{{ totalUsers }}</p>
              </div>
              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="text-[11px] text-white/45">Aksiya banerlar</p>
                <p class="mt-[8px] text-[24px] font-black">{{ totalBanners }}</p>
              </div>
            </div>

            <div class="mt-[14px] grid gap-[14px] lg:grid-cols-[1.3fr_1fr]">
              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="mb-[14px] text-[13px] font-black">Kategoriya bo'yicha mahsulotlar</p>
                <div class="space-y-[11px]">
                  <div v-for="c in categoryStats" :key="c.key" class="flex items-center gap-[10px]">
                    <component :is="c.icon" :size="15" class="shrink-0 text-white/40" />
                    <span class="w-[110px] shrink-0 truncate text-[11px] text-white/60">{{ c.label }}</span>
                    <div class="h-[9px] flex-1 overflow-hidden rounded-full bg-white/5">
                      <div class="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0]"
                        :style="{ width: (c.count / maxCategoryCount * 100) + '%' }"></div>
                    </div>
                    <span class="w-[22px] shrink-0 text-right text-[11px] font-bold text-white/70">{{ c.count }}</span>
                  </div>
                </div>
              </div>

              <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px]">
                <p class="mb-[12px] text-[13px] font-black">So'nggi qo'shilgan mahsulotlar</p>
                <div v-if="!recentProducts.length" class="py-[30px] text-center text-[12px] text-white/35">Hozircha
                  mahsulot yo'q.</div>
                <div v-else class="space-y-[9px]">
                  <div v-for="p in recentProducts" :key="p.id" class="flex items-center gap-[10px]">
                    <div
                      class="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-white/5">
                      <img v-if="p.image_url" :src="p.image_url" class="h-full w-full object-contain" />
                      <ImageOff v-else :size="14" class="text-white/25" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-[11px] font-bold">{{ p.nomi }}</p>
                      <p class="text-[10px] text-white/40">#{{ p.id }} &middot; {{ p.kategoriya }}</p>
                    </div>
                    <span
                      class="shrink-0 text-[11px] font-bold text-[#a78bfa]">{{ Number(p.puli || 0).toLocaleString('uz-UZ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== MAHSULOTLAR ===== -->
          <section v-else-if="tab === 'products'" class="fade">
            <div class="mb-[14px] flex flex-col gap-[10px] md:flex-row md:items-center md:justify-between">
              <div class="flex flex-1 flex-col gap-[9px] sm:flex-row">
                <div
                  class="flex h-[42px] flex-1 items-center gap-[8px] rounded-[10px] border border-white/10 bg-[#12111f] px-[12px]">
                  <Search :size="15" class="text-white/40" />
                  <input v-model="search" placeholder="Mahsulot qidirish..."
                    class="h-full w-full bg-transparent text-[12px] outline-none" />
                </div>
                <select v-model="categoryFilter"
                  class="h-[42px] rounded-[10px] border border-white/10 bg-[#12111f] px-[11px] text-[12px] outline-none">
                  <option value="">Barcha kategoriya</option>
                  <option v-for="c in CATEGORIES" :key="c.key" :value="c.key">{{ c.label }}</option>
                </select>
              </div>
              <button @click="openAdd"
                class="flex shrink-0 items-center justify-center gap-[7px] rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] px-[15px] py-[11px] text-[12px] font-black">
                <Plus :size="16" /> Mahsulot qo'shish
              </button>
            </div>

            <div v-if="!filteredProducts.length"
              class="rounded-[16px] border border-white/10 bg-[#12111f] p-[35px] text-center text-white/40">Mahsulot
              topilmadi.</div>
            <div v-else class="space-y-[8px]">
              <div v-for="p in filteredProducts" :key="p.id"
                class="flex flex-col gap-[12px] rounded-[15px] border border-white/8 bg-[#12111f] p-[11px] md:flex-row md:items-center">
                <div
                  class="flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white/5">
                  <img v-if="p.image_url" :src="p.image_url" class="h-full w-full object-contain p-[5px]" />
                  <ImageOff v-else :size="20" class="text-white/25" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-black">{{ p.nomi }}</p>
                  <p class="mt-[3px] text-[10px] text-white/40">{{ p.kategoriya }} &middot; ID #{{ p.id }} &middot; <span
                      :class="p.mavjud !== false ? 'text-emerald-400' : 'text-red-300'">{{ p.mavjud !== false ? 'Mavjud' :
                      'Tugagan'}}</span></p>
                  <p class="mt-[5px] text-[12px] font-bold text-[#a78bfa]">{{ Number(p.puli || 0).toLocaleString('uz-UZ') }}
                    so'm</p>
                </div>
                <div class="flex gap-[7px]">
                  <button @click="editProduct(p)"
                    class="flex items-center gap-[5px] rounded-[9px] border border-white/10 px-[10px] py-[8px] text-[10px] font-bold text-white/60 hover:text-white">
                    <Pencil :size="14" /> Tahrirlash
                  </button>
                  <button @click="removeProduct(p)"
                    class="flex items-center gap-[5px] rounded-[9px] border border-red-400/15 px-[10px] py-[8px] text-[10px] font-bold text-red-300">
                    <Trash2 :size="14" /> O'chirish
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== KATEGORIYALAR ===== -->
          <section v-else-if="tab === 'categories'" class="fade">
            <p class="mb-[14px] text-[11px] text-white/40">Kategoriyalar backendda belgilangan (Tovar modelidagi tayyor
              ro'yxat), shuning uchun bu yerda faqat ko'rish va mahsulotlarni filtrlash mumkin.</p>
            <div class="grid grid-cols-2 gap-[12px] md:grid-cols-3 lg:grid-cols-4">
              <button v-for="c in categoryStats" :key="c.key" @click="categoryFilter = c.key; selectTab('products')"
                class="rounded-[16px] border border-white/8 bg-[#12111f] p-[16px] text-left hover:border-[#8b5cf6]/40">
                <div
                  class="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#8b5cf6]/12 text-[#a78bfa]">
                  <component :is="c.icon" :size="18" />
                </div>
                <p class="mt-[12px] text-[13px] font-black">{{ c.label }}</p>
                <p class="mt-[3px] text-[11px] text-white/40">{{ c.count }} ta mahsulot</p>
              </button>
            </div>
          </section>

          <!-- ===== BUYURTMALAR ===== -->
          <section v-else-if="tab === 'orders'" class="fade">
            <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[40px] text-center">
              <div
                class="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-[15px] bg-[#8b5cf6]/12 text-[#a78bfa]">
                <ClipboardList :size="24" />
              </div>
              <p class="mt-[16px] text-[15px] font-black">Buyurtmalar tizimi hali ulanmagan</p>
              <p class="mx-auto mt-[7px] max-w-[420px] text-[12px] text-white/40">Hozirgi backendda (Django) Buyurtma
                (Order) modeli mavjud emas &mdash; faqat Mahsulot va Aksiya banerlari bor. Buyurtmalarni ko'rsatish
                uchun backendga yangi model va API qo'shish kerak bo'ladi.</p>
            </div>
          </section>

          <!-- ===== FOYDALANUVCHILAR ===== -->
          <section v-else-if="tab === 'users'" class="fade">
            <div
              class="mb-[14px] flex h-[42px] max-w-[320px] items-center gap-[8px] rounded-[10px] border border-white/10 bg-[#12111f] px-[12px]">
              <Search :size="15" class="text-white/40" />
              <input v-model="userSearch" placeholder="Ism yoki email bo'yicha qidirish..."
                class="h-full w-full bg-transparent text-[12px] outline-none" />
            </div>
            <div v-if="!filteredUsers.length"
              class="rounded-[16px] border border-white/10 bg-[#12111f] p-[35px] text-center text-white/40">
              Foydalanuvchi topilmadi.</div>
            <div v-else class="space-y-[8px]">
              <div v-for="u in filteredUsers" :key="u.id"
                class="flex items-center gap-[11px] rounded-[15px] border border-white/8 bg-[#12111f] p-[12px]">
                <div
                  class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#8b5cf6]/12 text-[13px] font-black text-[#a78bfa]">
                  {{ u.username?.charAt(0).toUpperCase() }}</div>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] font-black">{{ u.username }}</p>
                  <p class="truncate text-[10px] text-white/40">{{ u.email || 'Email ko\'rsatilmagan' }} &middot; ID
                    #{{ u.id }}</p>
                </div>
                <span v-if="u.is_staff"
                  class="hidden rounded-full bg-[#8b5cf6]/12 px-[8px] py-[4px] text-[9px] font-bold text-[#a78bfa] md:block">ADMIN</span>
                <button @click="removeUser(u)" class="rounded-[9px] border border-red-400/15 p-[9px] text-red-300">
                  <Trash2 :size="15" />
                </button>
              </div>
            </div>
          </section>

          <!-- ===== AKSIYALAR (Top banerlar) ===== -->
          <section v-else-if="tab === 'promo'" class="fade">
            <div class="mb-[14px] flex items-center justify-between">
              <p class="text-[11px] text-white/40">Bosh sahifadagi katta banner mahsulotlar (Top modeli).</p>
              <button @click="openAddBanner"
                class="flex items-center gap-[7px] rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] px-[13px] py-[10px] text-[11px] font-black">
                <Plus :size="15" /> Aksiya qo'shish
              </button>
            </div>
            <div v-if="!banners.length"
              class="rounded-[16px] border border-white/10 bg-[#12111f] p-[35px] text-center text-white/40">Hozircha
              aksiya banner yo'q.</div>
            <div v-else class="grid gap-[10px] md:grid-cols-2">
              <div v-for="b in banners" :key="b.id"
                class="flex items-center gap-[12px] rounded-[15px] border border-white/8 bg-[#12111f] p-[11px]">
                <div
                  class="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white/5">
                  <img v-if="b.image_url" :src="b.image_url" class="h-full w-full object-contain p-[5px]" />
                  <ImageOff v-else :size="18" class="text-white/25" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[12px] font-black">{{ b.nomi }}</p>
                  <p class="mt-[3px] text-[11px] font-bold text-[#a78bfa]">{{ Number(b.puli || 0).toLocaleString('uz-UZ') }}
                    so'm</p>
                </div>
                <div class="flex shrink-0 gap-[6px]">
                  <button @click="editBanner(b)" class="rounded-[9px] border border-white/10 p-[8px] text-white/60">
                    <Pencil :size="13" />
                  </button>
                  <button @click="removeBanner(b)" class="rounded-[9px] border border-red-400/15 p-[8px] text-red-300">
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== SOZLAMALAR ===== -->
          <section v-else-if="tab === 'settings'" class="fade max-w-[520px]">
            <div class="rounded-[16px] border border-white/8 bg-[#12111f] p-[18px]">
              <div class="flex items-center gap-[12px]">
                <div
                  class="flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[#8b5cf6]/12 text-[18px] font-black text-[#a78bfa]">
                  {{ adminName.charAt(0).toUpperCase() }}</div>
                <div>
                  <p class="text-[15px] font-black">{{ adminName }}</p>
                  <p class="text-[11px] text-white/40">Administrator</p>
                </div>
              </div>
            </div>
            <div class="mt-[12px] rounded-[16px] border border-white/8 bg-[#12111f] p-[18px]">
              <p class="text-[13px] font-black">Tizim ma'lumoti</p>
              <div class="mt-[12px] space-y-[9px] text-[12px]">
                <div class="flex items-center justify-between"><span class="text-white/45">Backend</span><span
                    class="font-bold">Django REST Framework</span></div>
                <div class="flex items-center justify-between"><span class="text-white/45">Frontend</span><span
                    class="font-bold">Vue 3 + Tailwind</span></div>
                <div class="flex items-center justify-between"><span class="text-white/45">Versiya</span><span
                    class="font-bold">1.0.0</span></div>
              </div>
              <p class="mt-[14px] text-[11px] text-white/35">Parolni o'zgartirish va profil sozlamalarini boshqarish
                uchun backendga alohida API qo'shilishi kerak.</p>
            </div>
          </section>

        </template>
      </main>
    </div>

    <!-- ============ MOBILE BOTTOM NAV ============ -->
    <nav class="fixed inset-x-0 bottom-0 z-[90] flex h-[64px] border-t border-white/8 bg-[#0e0d1c] lg:hidden">
      <button v-for="n in bottomNavItems" :key="n.key" @click="selectTab(n.key)"
        :class="tab === n.key ? 'text-[#a78bfa]' : 'text-white/45'"
        class="flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] font-bold">
        <component :is="n.icon" :size="19" /> {{ n.label }}
      </button>
    </nav>

    <!-- ============ MAHSULOT MODAL ============ -->
    <div v-if="showForm"
      class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-[12px] py-[25px] backdrop-blur-sm">
      <div class="w-full max-w-[620px] rounded-[20px] border border-white/10 bg-[#0f0e1c] p-[18px] shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-[19px] font-black">{{ editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot' }}</h3>
            <p class="text-[10px] text-white/35">Ma'lumotlarni kiriting va saqlang</p>
          </div>
          <button @click="resetForm" class="rounded-[9px] p-[8px] text-white/50">
            <X :size="19" />
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="mt-[18px] space-y-[11px]">
          <div><label class="mb-[5px] block text-[10px] text-white/50">Mahsulot nomi *</label><input v-model="form.nomi"
              class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none focus:border-[#8b5cf6]/50"
              placeholder="iPhone 15 Pro" /></div>
          <div class="flex flex-col gap-[10px] sm:flex-row">
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Kategoriya</label>
              <select v-model="form.kategoriya"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none">
                <option v-for="c in CATEGORIES" :key="c.key" :value="c.key">{{ c.label }}</option>
              </select>
            </div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Rasm</label><input
                @change="chooseImage" type="file" accept="image/*"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[8px] py-[10px] text-[10px] text-white/50" />
            </div>
          </div>
          <div class="flex flex-col gap-[10px] sm:flex-row">
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Narxi *</label><input
                v-model="form.puli" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none"
                placeholder="15000000" /></div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Eski narx</label><input
                v-model="form.eski_narx" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Oyiga</label><input
                v-model="form.oyiga_qancha" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
          </div>
          <div class="flex flex-col gap-[10px] sm:flex-row">
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Necha oyga</label><input
                v-model="form.necha_oyga" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Reyting</label><input
                v-model="form.reyting" type="number" step="0.1" min="0" max="5"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
          </div>
          <div><label class="mb-[5px] block text-[10px] text-white/50">Tavsif</label><textarea v-model="form.tavsif"
              rows="4"
              class="w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] py-[9px] text-[12px] outline-none"
              placeholder="Mahsulot haqida..."></textarea></div>
          <label class="flex items-center gap-[8px] text-[11px] text-white/60"><input v-model="form.mavjud"
              type="checkbox" class="accent-[#8b5cf6]" /> Mahsulot mavjud</label>
          <button :disabled="saving"
            class="h-[45px] w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] text-[12px] font-black disabled:opacity-50">{{ saving
              ? 'Saqlanmoqda...' : (editingId ? "O'zgarishlarni saqlash" : "Mahsulotni qo'shish")}}</button>
        </form>
      </div>
    </div>

    <!-- ============ AKSIYA MODAL ============ -->
    <div v-if="showBannerForm"
      class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-[12px] py-[25px] backdrop-blur-sm">
      <div class="w-full max-w-[480px] rounded-[20px] border border-white/10 bg-[#0f0e1c] p-[18px] shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-[19px] font-black">{{ editingBannerId ? 'Aksiyani tahrirlash' : 'Yangi aksiya' }}</h3>
            <p class="text-[10px] text-white/35">Bosh sahifa banneri uchun</p>
          </div>
          <button @click="resetBannerForm" class="rounded-[9px] p-[8px] text-white/50">
            <X :size="19" />
          </button>
        </div>
        <form @submit.prevent="saveBanner" class="mt-[18px] space-y-[11px]">
          <div><label class="mb-[5px] block text-[10px] text-white/50">Nomi *</label><input v-model="bannerForm.nomi"
              class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none focus:border-[#8b5cf6]/50"
              placeholder="iPhone 15" /></div>
          <div><label class="mb-[5px] block text-[10px] text-white/50">Rasm</label><input @change="chooseBannerImage"
              type="file" accept="image/*"
              class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[8px] py-[10px] text-[10px] text-white/50" />
          </div>
          <div class="flex flex-col gap-[10px] sm:flex-row">
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Narxi</label><input
                v-model="bannerForm.puli" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Oyiga</label><input
                v-model="bannerForm.oyiga_qancha" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
            <div class="flex-1"><label class="mb-[5px] block text-[10px] text-white/50">Necha oyga</label><input
                v-model="bannerForm.necha_oyga" type="number"
                class="h-[42px] w-full rounded-[10px] border border-white/10 bg-[#171628] px-[11px] text-[12px] outline-none" />
            </div>
          </div>
          <button :disabled="bannerSaving"
            class="h-[45px] w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] text-[12px] font-black disabled:opacity-50">{{ bannerSaving
              ? 'Saqlanmoqda...' : (editingBannerId ? "O'zgarishlarni saqlash" : "Aksiya qo'shish")}}</button>
        </form>
      </div>
    </div>
  </div>
</template>
