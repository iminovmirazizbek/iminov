<script setup>
import { onMounted, ref } from 'vue'
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, CreditCard, Smartphone, Laptop, Headphones, WashingMachine, Shirt, Dumbbell, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { api } from '../services/api'
const products = ref([]); const loading = ref(true)
const cats = [['telefon', 'Telefonlar', Smartphone], ['noutbuk', 'Noutbuklar', Laptop], ['aksessuar', 'Aksessuarlar', Headphones], ['texnika', 'Maishiy texnika', WashingMachine], ['kiyim', 'Kiyim', Shirt], ['sport', 'Sport', Dumbbell], ['gozallik', "Go'zallik", Sparkles]]
const benefits = [[Truck, 'Tez yetkazib berish', "150 000 so'mdan"], [ShieldCheck, 'Sifat kafolati', '100% original'], [CreditCard, "Qulay to'lov", 'Naqd va karta'], [CheckCircle2, '24/7 qo‘llab-quvvatlash', 'Doimiy yordam']]
async function load() { try { products.value = await api.getProducts() } catch (e) { } finally { loading.value = false } }
onMounted(load)
const money = (n) => n == null ? '—' : new Intl.NumberFormat('uz-UZ').format(Number(n)) + " so'm"
</script>
<template>
    <div class="fade">
        <section
            class="relative overflow-hidden rounded-[20px] border border-[#19f078]/15 bg-[#06110d] px-[20px] py-[28px] md:px-[42px] md:py-[42px]">
            <div
                class="absolute -right-[120px] -top-[150px] h-[420px] w-[420px] rounded-full bg-[#19f078]/10 blur-[70px]">
            </div>
            <div class="relative flex min-h-[300px] items-center">
                <div class="max-w-[620px]">
                    <p class="text-[12px] font-bold uppercase tracking-[3px] text-[#19f078]">Yangi avlod</p>
                    <h1
                        class="mt-[8px] text-[28px] font-black leading-[32px] tracking-[-1.2px] sm:text-[34px] sm:leading-[38px] md:text-[54px] md:leading-[58px]">
                        Siz uchun eng yaxshi <span class="text-[#19f078]">texnologiyalar!</span></h1>
                    <p class="mt-[13px] max-w-[500px] text-[13px] leading-[20px] text-white/55 sm:text-[14px] sm:leading-[22px]">Smartfonlar, noutbuklar,
                        aksessuarlar va boshqa mahsulotlar bir joyda.</p>
                    <RouterLink to="/kategoriya/telefon"
                        class="mt-[22px] inline-flex items-center gap-[8px] rounded-[11px] bg-[#19f078] px-[18px] py-[12px] text-[13px] font-black text-black">
                        Xarid qilish
                        <ArrowRight :size="17" />
                    </RouterLink>
                </div>
                <div class="ml-auto hidden h-[260px] w-[46%] items-center justify-center md:flex">
                    <div class="text-[120px] font-black italic text-[#19f078]/10">SHOPUZ</div>
                </div>
            </div>
        </section>
        <section class="mt-[12px] flex flex-wrap rounded-[16px] border border-white/10 bg-[#07100d] p-[10px]">
            <div v-for="x in benefits" :key="x[1]"
                class="flex min-w-[46%] flex-1 basis-[46%] items-center gap-[10px] px-[10px] py-[10px] sm:min-w-0 sm:basis-auto md:min-w-0">
                <component :is="x[0]" :size="21" class="text-[#19f078]" />
                <div>
                    <p class="text-[11px] font-bold">{{ x[1] }}</p>
                    <p class="text-[10px] text-white/40">{{ x[2] }}</p>
                </div>
            </div>
        </section>
        <section id="products" class="mt-[30px]">
            <div class="mb-[13px] flex items-center justify-between">
                <h2 class="text-[21px] font-black">🔥 Mashhur mahsulotlar</h2>
                <RouterLink to="/kategoriya/telefon" class="text-[12px] text-white/45 hover:text-[#19f078]">Barchasini
                    ko'rish
                    <ArrowRight :size="15" class="inline" />
                </RouterLink>
            </div>
            <div v-if="loading" class="py-[40px] text-center text-white/40">Yuklanmoqda...</div>
            <div v-else-if="!products.length"
                class="rounded-[15px] border border-white/10 p-[30px] text-center text-white/45">Admin paneldan mahsulot
                qo‘shing.</div>
            <div v-else
                class="flex gap-[10px] overflow-x-auto pb-[8px] md:grid md:grid-cols-3 md:gap-[14px] xl:grid-cols-6">
                <div v-for="p in products.slice(0, 12)" :key="p.id" class="min-w-[180px] shrink-0 sm:min-w-[210px] md:min-w-0">
                    <ProductCard :product="p" @add="$emit('add-cart', $event)" />
                </div>
            </div>
        </section>
        <section class="mt-[30px] flex flex-col gap-[12px] md:flex-row">
            <div
                class="flex-1 rounded-[18px] border border-[#19f078]/15 bg-gradient-to-br from-[#0b2a1c] to-[#06100d] p-[25px]">
                <p class="text-[11px] font-bold text-[#19f078]">MAXSUS TAKLIF</p>
                <h3 class="mt-[8px] text-[25px] font-black">Smartfonlar bo'yicha katta chegirmalar!</h3>
                <p class="mt-[6px] text-[12px] text-white/45">Cheklangan vaqt uchun maxsus narxlar.</p>
                <RouterLink to="/kategoriya/telefon"
                    class="mt-[18px] inline-block rounded-[10px] bg-[#19f078] px-[15px] py-[10px] text-[12px] font-black text-black">
                    Batafsil →</RouterLink>
            </div>
            <div class="flex-1 rounded-[18px] border border-white/10 bg-[#08120f] p-[25px]">
                <p class="text-[11px] font-bold text-[#19f078]">YANGI KELGANLAR</p>
                <h3 class="mt-[8px] text-[25px] font-black">Har bir detal siz uchun!</h3>
                <p class="mt-[6px] text-[12px] text-white/45">Yangi modellar va sifatli aksessuarlar.</p>
                <RouterLink to="/kategoriya/aksessuar"
                    class="mt-[18px] inline-block rounded-[10px] border border-[#19f078]/40 px-[15px] py-[10px] text-[12px] font-bold text-[#19f078]">
                    Ko'rish →</RouterLink>
            </div>
        </section>
        <section class="mt-[30px]">
            <h2 class="mb-[13px] text-[21px] font-black">Kategoriyalar</h2>
            <div class="flex gap-[9px] overflow-x-auto pb-[5px]">
                <RouterLink v-for="c in cats" :key="c[0]" :to="`/kategoriya/${c[0]}`"
                    class="flex min-w-[115px] flex-col items-center justify-center rounded-[14px] border border-white/10 bg-[#08120f] px-[12px] py-[17px] hover:border-[#19f078]/30">
                    <component :is="c[2]" :size="22" class="text-[#19f078]" /><span
                        class="mt-[8px] text-[11px] font-bold">{{ c[1] }}</span>
                </RouterLink>
            </div>
        </section>
    </div>
</template>
