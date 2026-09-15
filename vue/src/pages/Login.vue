<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { LogIn, LockKeyhole, Eye, EyeOff, UserRound } from 'lucide-vue-next'
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
    const data = await api.login(username.value, password.value)
    localStorage.setItem('shopuz-token', data.token)
    localStorage.setItem('shopuz-username', data.username)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Kirishda xatolik.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center py-[30px]">
    <div class="w-full max-w-[430px] rounded-[22px] border border-white/10 bg-[#0b1613] p-[25px] shadow-2xl">
      <div class="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[17px] bg-[#19f078] text-black">
        <LogIn :size="30" />
      </div>
      <h1 class="mt-[18px] text-center text-[26px] font-black">Kirish</h1>
      <p class="mt-[6px] text-center text-[12px] text-white/40">ShopUz akkauntingizga kiring</p>

      <form @submit.prevent="login" class="mt-[25px] space-y-[13px]">
        <div>
          <label class="mb-[7px] block text-[11px] font-bold text-white/60">Login</label>
          <div class="flex items-center rounded-[11px] border border-white/10 bg-[#101b18] focus-within:border-[#19f078]/60">
            <UserRound :size="17" class="ml-[13px] text-white/35" />
            <input v-model="username" autocomplete="username"
              class="h-[46px] w-full bg-transparent px-[10px] text-[13px] outline-none" placeholder="username" />
          </div>
        </div>
        <div>
          <label class="mb-[7px] block text-[11px] font-bold text-white/60">Parol</label>
          <div class="flex items-center rounded-[11px] border border-white/10 bg-[#101b18] focus-within:border-[#19f078]/60">
            <LockKeyhole :size="17" class="ml-[13px] text-white/35" />
            <input v-model="password" :type="show ? 'text' : 'password'" autocomplete="current-password"
              class="h-[46px] w-full bg-transparent px-[10px] text-[13px] outline-none" placeholder="••••••••" />
            <button type="button" @click="show = !show" class="mr-[10px] p-[6px] text-white/40">
              <EyeOff v-if="show" :size="17" />
              <Eye v-else :size="17" />
            </button>
          </div>
        </div>
        <p v-if="error" class="rounded-[10px] border border-red-400/20 bg-red-400/5 px-[11px] py-[9px] text-[11px] text-red-300">
          {{ error }}</p>
        <button :disabled="loading"
          class="h-[47px] w-full rounded-[11px] bg-[#19f078] text-[13px] font-black text-black disabled:opacity-50">
          {{ loading ? 'Tekshirilmoqda...' : 'Kirish' }}
        </button>
      </form>
      <p class="mt-[16px] text-center text-[12px] text-white/40">
        Akkountingiz yo'qmi?
        <RouterLink to="/register" class="font-bold text-[#19f078] hover:underline">Ro'yxatdan o'tish</RouterLink>
      </p>
      <RouterLink to="/admin/login" class="mt-[12px] block text-center text-[12px] font-bold text-[#19f078] hover:underline">Admin panelga o'tish</RouterLink>
    </div>
  </div>
</template>
