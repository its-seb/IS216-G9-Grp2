<script setup>
const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
  showIngredients: {
    type: Boolean,
    default: false,
    required: false,
  },
  showPreparationTime: {
    type: Boolean,
    default: false,
    required: false,
  },
  isFridgeRecipe: {
    type: Boolean,
    default: false,
    required: false,
  },
});
</script>

<template>
  <div
    class="card bg-base-100 border p-2 rounded-2xl hover:cursor-pointer hover:shadow-md ease-in duration-150"
  >
    <img class="h-[200px] object-cover rounded-lg" :src="recipe.image" alt="" />
    <div class="card-body pt-4 pb-2 px-2 gap-0 text-center">
      <h2 class="card-title truncate block text-md">{{ recipe.title }}</h2>
      <template v-if="isFridgeRecipe">
        <p
          v-if="recipe.missedIngredientCount > 0"
          class="text-gray-500 text-sm"
        >
          {{ recipe.missedIngredientCount + " Missing Ingredients" }}
        </p>
        <p v-else class="text-gray-500 text-sm">No Missing Ingredients</p>
      </template>
      <template v-else>
        <p v-if="showIngredients" class="text-gray-500 text-sm">
          {{ recipe.extendedIngredients.length }} Ingredients
        </p>
        <p v-if="showPreparationTime" class="text-gray-500 text-sm">
          {{ recipe.readyInMinutes }} Minutes
        </p>
      </template>
    </div>
  </div>
</template>
