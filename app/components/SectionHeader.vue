<template>
  <div :class="['reveal', centered ? 'text-center' : '']" :data-delay="delay">
    <div v-if="label" class="section-label" :class="centered ? 'mx-auto' : ''">
      <span v-if="labelIcon" v-html="labelIcon" />
      {{ label }}
    </div>
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="subtitle" class="section-sub" :class="centered ? 'max-w-xl mx-auto' : 'max-w-lg'">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  label:     { type: String,  default: '' },
  labelIcon: { type: String,  default: '' },
  title:     { type: String,  required: true },
  subtitle:  { type: String,  default: '' },
  centered:  { type: Boolean, default: true },
  delay:     { type: String,  default: '0s' },
})
</script>