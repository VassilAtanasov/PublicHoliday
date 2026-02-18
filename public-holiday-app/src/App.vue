<script setup lang="ts">
import { ref, onMounted } from 'vue'

const title = ref('')
const description = ref('')
const loading = ref(true)
const error = ref('')

const fetchHolidayData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
    const question = `Return a plain-text list (no other Markdown). List national public holidays (off work) on ${formattedDate} worldwide. Always put United States holidays first (if any). Verify it is a non-working day in the country. Group by holiday name with countries in parentheses, ordered by popularity. No explanations.`
    const url = `https://funcapp-hnn5vijj5yj7e.azurewebsites.net/api/Function1?question=${encodeURIComponent(question)}`
    const response = await fetch(url, {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    
    // Split text by newline to get first line as title and rest as description
    const lines = text.split('\n')
    title.value = lines[0] || 'No holiday data available'
    description.value = lines.slice(1).join('\n').trim()
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch holiday data'
    console.error('Error fetching holiday data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHolidayData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 class="text-2xl font-bold text-center">🎉 Public Holiday</h1>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p class="mt-4 text-gray-600">Loading holiday information...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <div class="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button 
              @click="fetchHolidayData"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
          
          <!-- Success State -->
          <div v-else class="space-y-4">
            <!-- Title -->
            <div class="border-l-4 border-blue-600 pl-4">
              <h2 class="text-2xl font-bold text-gray-800 leading-tight">{{ title }}</h2>
            </div>
            
            <!-- Description -->
            <div v-if="description" class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ description }}</p>
            </div>
            
            <!-- Refresh Button -->
            <div class="pt-4">
              <button 
                @click="fetchHolidayData"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
          <p>Updated: {{ new Date().toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
