<template>
  <div class="language-selector">
    <button 
      @click="changeLanguage('ca')"
      :class="{ active: currentLocale === 'ca' }"
      class="lang-btn"
    >
      CA
    </button>
    <button 
      @click="changeLanguage('en')"
      :class="{ active: currentLocale === 'en' }"
      class="lang-btn"
    >
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
.language-selector {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #646cff;
  background: transparent;
  color: #646cff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: #646cff;
  color: #fff;
}

.lang-btn.active {
  background: #646cff;
  color: #fff;
}
</style>
