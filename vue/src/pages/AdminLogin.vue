<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LockKeyhole, ShieldCheck, Eye, EyeOff } from 'lucide-vue-next'
import { api } from '../services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Login va parolni kiriting.'
    return
  }
  loading.value = true
  try {
    const data = await api.adminLogin(username.value, password.value)
    localStorage.setItem('shopuz-admin-token', data.token)
    localStorage.setItem('shopuz-admin-name', data.username)
    router.push('/admin')
  } catch (e) {
    error.value = e.message || 'Kirishda xatolik.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center py-[30px]">
    <div class="w-full max-w-[430px] rounded-[22px] border border-white/10 bg-[#0f0e1c] p-[25px] shadow-2xl">
      <div
        class="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[17px] bg-gradient-to-br from-[#8b5cf6] to-[#5b3df0]">
        <ShieldCheck :size="30" />
      </div>
      <h1 class="mt-[18px] text-center text-[26px] font-black">Admin panel</h1>
      <p class="mt-[6px] text-center text-[12px] text-white/40">ShopUz boshqaruv paneliga kirish</p>

      <form @submit.prevent="login" class="mt-[25px] space-y-[13px]">
        <div>
          <label class="mb-[7px] block text-[11px] font-bold text-white/60">Login</label>
          <input v-model="username" autocomplete="username"
            class="h-[46px] w-full rounded-[11px] border border-white/10 bg-[#171628] px-[13px] text-[13px] outline-none focus:border-[#8b5cf6]/60"
            placeholder="admin" />
        </div>
        <div>
          <label class="mb-[7px] block text-[11px] font-bold text-white/60">Parol</label>
          <div
            class="flex items-center rounded-[11px] border border-white/10 bg-[#171628] focus-within:border-[#8b5cf6]/60">
            <LockKeyhole :size="17" class="ml-[13px] text-white/35" />
            <input v-model="password" :type="show ? 'text' : 'password'" autocomplete="current-password"
              class="h-[46px] w-full bg-transparent px-[10px] text-[13px] outline-none" placeholder="••••••••" />
            <button type="button" @click="show = !show" class="mr-[10px] p-[6px] text-white/40">
              <EyeOff v-if="show" :size="17" />
              <Eye v-else :size="17" />
            </button>
          </div>
        </div>
        <p v-if="error"
          class="rounded-[10px] border border-red-400/20 bg-red-400/5 px-[11px] py-[9px] text-[11px] text-red-300">
          {{ error }}</p>
        <button :disabled="loading"
          class="h-[47px] w-full rounded-[11px] bg-gradient-to-r from-[#8b5cf6] to-[#5b3df0] text-[13px] font-black disabled:opacity-50">
          {{ loading ? 'Tekshirilmoqda...' : 'Kirish' }}
        </button>
      </form>
      <p class="mt-[16px] text-center text-[10px] text-white/25">Faqat administratorlar uchun</p>
    </div>
  </div>
</template>
