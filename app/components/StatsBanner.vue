<template>
  <section class="bg-primary py-16 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
      <div class="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
    </div>
    <div class="container-site relative">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          class="text-center reveal"
          :data-delay="`${i * 0.08}s`"
        >
          <div class="text-[2.5rem] font-extrabold text-white leading-none mb-1 tracking-tight">{{ s.value }}</div>
          <div class="text-sm text-green-200 font-medium">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { value: '500+',  label: 'Happy Clients'     },
  { value: '98%',   label: 'Success Rate'       },
  { value: '1000+', label: 'Meal Plans Created' },
  { value: '8+',    label: 'Years Experience'   },
]
</script>