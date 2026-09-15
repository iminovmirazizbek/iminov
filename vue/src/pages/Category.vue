<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { api } from '../services/api'
const route = useRoute(); const products = ref([]); const loading = ref(true); const search = ref('')
const names = { telefon: 'Telefonlar', noutbuk: 'Noutbuklar', aksessuar: 'Aksessuarlar', texnika: 'Maishiy texnika', kiyim: 'Kiyim', sport: 'Sport', gozallik: "Go'zallik" }
async function load() { try { products.value = await api.getProducts() } finally { loading.value = false } }
onMounted(load)
const filtered = computed(() => products.value.filter(p => (p.kategoriya === route.params.slug || !p.kategoriya || route.params.slug === 'telefon') && (!search.value || (p.nomi || '').toLowerCase().includes(search.value.toLowerCase()))))
</script>
<template>
    <div class="fade">
        <div class="flex flex-col gap-[15px] md:flex-row md:items-end md:justify-between">
            <div>
                <p class="text-[12px] text-[#19f078]">Bosh sahifa / Kategoriya</p>
                <h1 class="mt-[7px] text-[30px] font-black">{{ names[route.params.slug] || 'Mahsulotlar' }}</h1>
                <p class="mt-[5px] text-[12px] text-white/40">{{ filtered.length }} ta mahsulot</p>
            </div><input v-model="search" placeholder="Shu kategoriyadan qidiring..."
                class="h-[43px] rounded-[11px] border border-white/10 bg-[#08120f] px-[14px] text-[12px] outline-none focus:border-[#19f078]/50 md:w-[300px]" />
        </div>
        <div v-if="loading" class="py-[60px] text-center text-white/40">Yuklanmoqda...</div>
        <div v-else-if="!filtered.length"
            class="mt-[25px] rounded-[15px] border border-white/10 p-[35px] text-center text-white/40">Bu kategoriyada
            mahsulot topilmadi.</div>
        <div v-else class="mt-[20px] flex flex-col gap-[12px] md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <ProductCard v-for="p in filtered" :key="p.id" :product="p" @add="$emit('add-cart', $event)" />
        </div>
    </div>
</template>
