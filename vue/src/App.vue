<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Search, ShoppingCart, UserRound, Heart, Menu, X, Home, Smartphone, Laptop, Headphones, WashingMachine, Shirt, Dumbbell, Sparkles } from 'lucide-vue-next'

const search = ref('')
const open = ref(false)
const cart = ref(JSON.parse(localStorage.getItem('shopuz-cart') || '[]'))
const count = computed(() => cart.value.reduce((s,p)=>s+(p.qty||1),0))
const username = ref(localStorage.getItem('shopuz-username') || '')

function logout(){
  localStorage.removeItem('shopuz-token')
  localStorage.removeItem('shopuz-username')
  username.value = ''
}

function saveCart(){ localStorage.setItem('shopuz-cart', JSON.stringify(cart.value)) }
function addToCart(product){
  const found = cart.value.find(x=>x.id===product.id)
  if(found) found.qty = (found.qty||1)+1
  else cart.value.push({...product, qty:1})
  saveCart()
}
function goSearch(){
  if(search.value.trim()) window.location.href = `/kategoriya/telefon?q=${encodeURIComponent(search.value.trim())}`
}
const cats=[['telefon','Telefonlar',Smartphone],['noutbuk','Noutbuklar',Laptop],['aksessuar','Aksessuarlar',Headphones],['texnika','Maishiy texnika',WashingMachine],['kiyim','Kiyim',Shirt],['sport','Sport',Dumbbell],['gozallik',"Go'zallik",Sparkles]]
</script>

<template>
<div class="min-h-screen bg-[#020807] text-white">
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[#06100d]/95 backdrop-blur-xl">
    <div class="mx-auto flex h-[72px] max-w-[1440px] items-center gap-[18px] px-[18px] lg:px-[30px]">
      <button class="lg:hidden rounded-[12px] border border-white/10 p-[10px]" @click="open=!open"><X v-if="open" :size="20"/><Menu v-else :size="20"/></button>
      <RouterLink to="/" class="flex shrink-0 items-center gap-[8px] text-[22px] font-black tracking-[-1px]"><span class="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] bg-[#19f078] text-black">S</span>Shop<span class="text-[#19f078]">Uz</span></RouterLink>
      <form @submit.prevent="goSearch" class="hidden max-w-[520px] flex-1 md:flex">
        <div class="flex w-full items-center rounded-[13px] border border-white/10 bg-[#101b18] px-[14px] focus-within:border-[#19f078]/60"><Search :size="18" class="text-white/50"/><input v-model="search" placeholder="Mahsulot nomini qidiring..." class="h-[42px] w-full bg-transparent px-[10px] text-[14px] outline-none"/><button class="text-[#19f078]" type="submit"><Search :size="18"/></button></div>
      </form>
      <nav class="ml-auto hidden items-center gap-[8px] md:flex"><RouterLink to="/" class="rounded-[10px] px-[13px] py-[10px] text-[13px] text-white/75 hover:bg-white/5 hover:text-white">Bosh sahifa</RouterLink><RouterLink to="/kategoriya/telefon" class="rounded-[10px] px-[13px] py-[10px] text-[13px] text-white/75 hover:bg-white/5 hover:text-white">Kategoriyalar</RouterLink><RouterLink to="/savatcha" class="relative rounded-[10px] px-[13px] py-[10px] text-[13px] text-white/75 hover:bg-white/5 hover:text-white"><ShoppingCart :size="17" class="inline"/> Savatcha <span v-if="count" class="ml-[3px] rounded-full bg-[#19f078] px-[6px] py-[2px] text-[10px] font-bold text-black">{{count}}</span></RouterLink><RouterLink to="/admin/login" class="rounded-[10px] border border-[#19f078]/20 px-[13px] py-[10px] text-[13px] font-bold text-[#19f078] hover:bg-[#19f078]/10">Admin</RouterLink><RouterLink v-if="!username" to="/login" class="rounded-[10px] px-[13px] py-[10px] text-[13px] text-white/75 hover:bg-white/5"><UserRound :size="17" class="inline"/> Kirish</RouterLink><button v-else @click="logout" class="rounded-[10px] px-[13px] py-[10px] text-[13px] text-white/75 hover:bg-white/5"><UserRound :size="17" class="inline"/> {{ username }} · Chiqish</button></nav>
    </div>
    <div class="px-[18px] pb-[10px] md:hidden"><div class="flex items-center rounded-[12px] border border-white/10 bg-[#101b18] px-[12px]"><Search :size="17" class="text-white/50"/><input v-model="search" @keyup.enter="goSearch" placeholder="Mahsulot qidiring..." class="h-[40px] w-full bg-transparent px-[9px] text-[13px] outline-none"/></div></div>
    <div v-if="open" class="border-t border-white/10 bg-[#06100d] p-[15px] lg:hidden"><RouterLink @click="open=false" to="/" class="mb-[6px] flex items-center gap-[10px] rounded-[10px] p-[11px] hover:bg-white/5"><Home :size="18"/> Bosh sahifa</RouterLink><RouterLink v-for="c in cats" :key="c[0]" @click="open=false" :to="`/kategoriya/${c[0]}`" class="flex items-center gap-[10px] rounded-[10px] p-[11px] hover:bg-white/5"><component :is="c[2]" :size="18"/> {{c[1]}}</RouterLink></div>
  </header>

  <main class="mx-auto max-w-[1440px] px-[14px] py-[18px] md:px-[24px] lg:px-[30px]"><RouterView v-slot="{Component}"><component :is="Component" @add-cart="addToCart" /></RouterView></main>
  <footer class="mt-[30px] border-t border-white/10 bg-[#040b09]"><div class="mx-auto max-w-[1440px] px-[24px] py-[34px] lg:px-[30px]"><div class="flex flex-col gap-[25px] md:flex-row md:justify-between"><div><div class="text-[23px] font-black">Shop<span class="text-[#19f078]">Uz</span></div><p class="mt-[8px] max-w-[300px] text-[13px] text-white/45">Sizning ishonchli va zamonaviy onlayn do'koningiz.</p></div><div><p class="mb-[9px] text-[13px] font-bold">Foydali havolalar</p><p class="text-[12px] text-white/50">Bosh sahifa · Kategoriyalar · Yetkazib berish · Qaytarish</p></div><div><p class="mb-[9px] text-[13px] font-bold">Aloqa</p><p class="text-[12px] text-white/50">+998 90 123 45 67 · info@shopuz.uz</p></div></div><div class="mt-[25px] border-t border-white/10 pt-[18px] text-[11px] text-white/35">© 2026 ShopUz. Barcha huquqlar himoyalangan.</div></div></footer>
</div>
</template>
