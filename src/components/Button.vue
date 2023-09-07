<script setup>
defineProps({
  class_name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['logIn'])
const onClick = () => emit('logIn')
</script>
<template>
  <button @click="onClick()" style="{{ background: color }}" class="{{ class_name }}">
    {{ text }}
  </button>
</template>
<style scoped>
.btn {
  color: white;
}
.btn2 {
  color: black;
}
button {
  border-radius: 8px;
  border-width: 0;
  color: #333333;
  cursor: pointer;
  display: inline-block;
  font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  margin: 0;
  padding: 10px 12px;
  text-align: center;
  transition: all 200ms;
  vertical-align: baseline;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 60px;
}
</style>
