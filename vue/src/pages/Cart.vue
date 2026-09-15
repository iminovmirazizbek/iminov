<script setup>
import { computed, ref } from 'vue'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-vue-next'
const items = ref(JSON.parse(localStorage.getItem('shopuz-cart') || '[]'))
const money = (n) => new Intl.NumberFormat('uz-UZ').format(Number(n)) + " so'm"
const total = computed(() => items.value.reduce((s, x) => s + Number(x.puli || 0) * (x.qty || 1), 0))
function save() { localStorage.setItem('shopuz-cart', JSON.stringify(items.value)) }
function del(i) { items.value.splice(i, 1); save() }
function qty(x, d) { x.qty = Math.max(1, (x.qty || 1) + d); save() }
</script>
<template>
    <div class="fade">
        <h1 class="text-[30px] font-black">Savatcha</h1>
        <div v-if="!items.length"
            class="mt-[20px] rounded-[18px] border border-white/10 bg-[#08120f] p-[45px] text-center">
            <ShoppingBag :size="45" class="mx-auto text-[#19f078]" />
            <p class="mt-[15px] text-[15px] font-bold">Savatchangiz hozircha bo'sh</p>
        </div>
        <div v-else class="mt-[20px] grid gap-[15px] lg:grid-cols-[1fr_360px]">
            <div class="space-y-[9px]">
                <div v-for="(x, i) in items" :key="x.id"
                    class="flex gap-[13px] rounded-[15px] border border-white/10 bg-[#08120f] p-[12px]">
                    <div
                        class="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-[10px] bg-[#0d1915]">
                        <img v-if="x.image_url" :src="x.image_url" class="h-full w-full object-contain" /><span v-else
                            class="text-[30px] font-black text-[#19f078]/20">S</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-[14px] font-bold">{{ x.nomi }}</p>
                        <p class="mt-[5px] text-[14px] font-black">{{ money(x.puli) }}</p>
                        <div class="mt-[10px] flex items-center gap-[8px]"><button @click="qty(x, -1)"
                                class="rounded-[7px] border border-white/10 p-[5px]">
                                <Minus :size="13" />
                            </button><span class="min-w-[18px] text-center text-[12px]">{{ x.qty }}</span><button
                                @click="qty(x, 1)" class="rounded-[7px] border border-white/10 p-[5px]">
                                <Plus :size="13" />
                            </button></div>
                    </div><button @click="del(i)"
                        class="self-start rounded-[8px] p-[8px] text-white/40 hover:text-red-400">
                        <Trash2 :size="17" />
                    </button>
                </div>
            </div>
            <aside class="h-fit rounded-[18px] border border-white/10 bg-[#08120f] p-[20px]">
                <p class="text-[15px] font-bold">Buyurtma</p>
                <div class="mt-[18px] flex justify-between text-[12px] text-white/45">
                    <span>Mahsulotlar</span><span>{{ items.length }} ta</span>
                </div>
                <div class="mt-[18px] flex justify-between border-t border-white/10 pt-[15px]"><span
                        class="text-[13px]">Jami</span><b class="text-[19px]">{{ money(total) }}</b></div><button
                    class="mt-[18px] h-[46px] w-full rounded-[11px] bg-[#19f078] text-[13px] font-black text-black">Buyurtma
                    berish</button>
            </aside>
        </div>
    </div>
</template>
