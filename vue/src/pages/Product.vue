<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
const route = useRoute(); const product = ref(null); const loading = ref(true)
import { api } from '../services/api'
async function load() { try { product.value = await api.getProduct(route.params.id) } finally { loading.value = false } }
onMounted(load)
const money = (n) => n == null ? '—' : new Intl.NumberFormat('uz-UZ').format(Number(n)) + " so'm"
function add() { if (!product.value) return; const c = JSON.parse(localStorage.getItem('shopuz-cart') || '[]'); const f = c.find(x => x.id === product.value.id); if (f) f.qty = (f.qty || 1) + 1; else c.push({ ...product.value, qty: 1 }); localStorage.setItem('shopuz-cart', JSON.stringify(c)); alert('Savatchaga qo‘shildi') }
</script>
<template>
    <div class="fade">
        <RouterLink to="/"
            class="mb-[15px] inline-flex items-center gap-[7px] text-[12px] text-white/45 hover:text-white">
            <ArrowLeft :size="15" /> Orqaga
        </RouterLink>
        <div v-if="loading" class="py-[60px] text-center">Yuklanmoqda...</div>
        <div v-else-if="!product" class="py-[60px] text-center text-white/45">Mahsulot topilmadi.</div>
        <div v-else class="grid gap-[16px] lg:grid-cols-[1.05fr_.95fr]">
            <div
                class="flex min-h-[450px] items-center justify-center rounded-[20px] border border-white/10 bg-[#08120f] p-[25px]">
                <img v-if="product.image_url" :src="product.image_url" class="max-h-[440px] w-full object-contain" />
                <div v-else class="text-[150px] font-black text-[#19f078]/15">S</div>
            </div>
            <div class="rounded-[20px] border border-white/10 bg-[#08120f] p-[24px]">
                <div class="flex items-start justify-between gap-[12px]">
                    <div>
                        <p class="text-[11px] uppercase tracking-[2px] text-[#19f078]">{{ product.kategoriya }}</p>
                        <h1 class="mt-[8px] text-[30px] font-black">{{ product.nomi }}</h1>
                    </div><button class="rounded-full border border-white/10 p-[10px]">
                        <Heart :size="18" />
                    </button>
                </div>
                <div class="mt-[12px] flex items-center gap-[7px] text-[12px] text-white/55">
                    <Star :size="15" fill="#19f078" class="text-[#19f078]" /> {{ product.reyting }} ·
                    {{ product.izohlar_soni }} ta izoh
                </div>
                <div class="mt-[24px] text-[30px] font-black">{{ money(product.puli) }}</div>
                <div v-if="product.oyiga_qancha" class="mt-[5px] text-[13px] text-[#19f078]">oyiga
                    {{ money(product.oyiga_qancha) }} dan · {{ product.necha_oyga || 12 }} oy</div>
                <p class="mt-[20px] text-[13px] leading-[22px] text-white/50">{{ product.tavsif || 'Sifatli mahsulot. Tez yetkazib berish va qulay to‘lov imkoniyati mavjud.' }}</p>
                <div class="mt-[24px] grid gap-[8px] sm:grid-cols-3">
                    <div class="rounded-[12px] bg-[#0d1915] p-[12px]">
                        <Truck :size="18" class="text-[#19f078]" />
                        <p class="mt-[7px] text-[10px] text-white/50">Tez yetkazib berish</p>
                    </div>
                    <div class="rounded-[12px] bg-[#0d1915] p-[12px]">
                        <ShieldCheck :size="18" class="text-[#19f078]" />
                        <p class="mt-[7px] text-[10px] text-white/50">Sifat kafolati</p>
                    </div>
                    <div class="rounded-[12px] bg-[#0d1915] p-[12px]">
                        <CheckCircle2 :size="18" class="text-[#19f078]" />
                        <p class="mt-[7px] text-[10px] text-white/50">Mavjud</p>
                    </div>
                </div><button @click="add"
                    class="mt-[22px] flex h-[49px] w-full items-center justify-center gap-[8px] rounded-[12px] bg-[#19f078] text-[13px] font-black text-black hover:bg-[#4aff96]">
                    <ShoppingCart :size="18" /> Savatchaga qo‘shish
                </button>
            </div>
        </div>
    </div>
</template>
