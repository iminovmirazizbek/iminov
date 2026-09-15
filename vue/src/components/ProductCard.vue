<script setup>
import { Heart, ShoppingCart, Star } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
defineProps({product:Object})
defineEmits(['add'])
const money = (n) => n == null ? '—' : new Intl.NumberFormat('uz-UZ').format(Number(n)) + " so'm"
</script>
<template>
<article class="group overflow-hidden rounded-[16px] border border-white/10 bg-[#08120f] p-[10px] transition duration-200 hover:-translate-y-[3px] hover:border-[#19f078]/35 hover:bg-[#0a1713]">
  <RouterLink :to="`/product/${product.id}`" class="block"><div class="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[12px] bg-[#0d1915] sm:h-[190px] md:h-[210px]"><span v-if="product.eski_narx" class="absolute left-[9px] top-[9px] z-10 rounded-full bg-[#19f078] px-[7px] py-[4px] text-[10px] font-black text-black">Chegirma</span><button class="absolute right-[9px] top-[9px] z-10 rounded-full border border-white/10 bg-black/30 p-[7px] text-white/70"><Heart :size="16"/></button><img v-if="product.image_url" :src="product.image_url" :alt="product.nomi" class="h-full w-full object-contain p-[15px] transition duration-300 group-hover:scale-105"/><div v-else class="text-[52px] font-black text-[#19f078]/25">S</div></div></RouterLink>
  <div class="px-[4px] pt-[12px]"><RouterLink :to="`/product/${product.id}`" class="line-clamp-2 min-h-[42px] text-[14px] font-bold leading-[20px] hover:text-[#19f078]">{{product.nomi || 'Mahsulot'}}</RouterLink><div class="mt-[5px] flex items-center gap-[5px] text-[11px] text-white/50"><Star :size="13" fill="#19f078" class="text-[#19f078]"/> {{product.reyting || '4.8'}} · {{product.izohlar_soni || 0}} ta izoh</div><div class="mt-[9px] text-[16px] font-black">{{money(product.puli)}}</div><div v-if="product.oyiga_qancha" class="mt-[3px] text-[11px] text-[#19f078]">oyiga {{money(product.oyiga_qancha)}} dan</div><button @click.stop="$emit('add', product)" class="mt-[11px] flex h-[40px] w-full items-center justify-center gap-[7px] rounded-[10px] bg-[#19f078] text-[12px] font-black text-black hover:bg-[#4aff96]"><ShoppingCart :size="16"/> Savatchaga qo'shish</button></div>
</article>
</template>
