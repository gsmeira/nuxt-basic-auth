<template>
  <ul class="flex justify-between bg-gray-100 px-10 py-2">
    <li><NuxtLink to="/" active-class="font-bold">/index</NuxtLink></li>
    <li><NuxtLink to="/alt" active-class="font-bold">/alt</NuxtLink></li>
    <li><NuxtLink to="/test" active-class="font-bold">/test</NuxtLink></li>
    <li><NuxtLink to="/admin" active-class="font-bold">/admin</NuxtLink></li>
    <li><NuxtLink to="/admin/something" active-class="font-bold">/admin/something</NuxtLink></li>
  </ul>
  <div class="container mx-auto mt-5">
    <slot />
  </div>
</template>
