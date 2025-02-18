<script setup lang="ts">
import { Folder, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { ref, inject } from 'vue'
import type { Folder as FolderType } from '../types/folder'

defineProps<{
  folders: FolderType[]
}>()

const emit = defineEmits<{
  (e: 'select-folder', folder: FolderType): void
}>()

const selectedFolder = inject<FolderType | null>('selectedFolder')

const expandedFolders = ref<Set<number>>(new Set())

const toggleFolder = async (folder: FolderType, event: Event) => {
  event.stopPropagation()
  if (expandedFolders.value.has(folder.id)) {
    expandedFolders.value.delete(folder.id)
  } else {
    expandedFolders.value.add(folder.id)
    await selectFolder(folder)
  }
}

const selectFolder = async (folder: FolderType) => {
  emit('select-folder', folder)
}
</script>

<template>
  <ul class="pl-4">
    <li v-for="folder in folders" :key="folder.id" class="mb-2">
      <div
        class="flex items-center space-x-2 cursor-pointer hover:bg-gray-300 p-2 rounded"
        @click="selectFolder(folder)"
      >
        <component
          :is="
            folder.subfolders && folder.subfolders.length > 0
              ? expandedFolders.has(folder.id)
                ? ChevronDown
                : ChevronRight
              : 'div'
          "
          class="w-4 h-4"
          @click="(event) => toggleFolder(folder, event)"
        />
        <Folder class="text-yellow-500" />
        <span :class="{ 'font-semibold': selectedFolder === folder }">{{ folder.name }}</span>
      </div>
      <Transition name="fade">
        <FolderTree
          v-if="expandedFolders.has(folder.id) && folder.subfolders && folder.subfolders.length > 0"
          :folders="folder.subfolders"
          @select-folder="selectFolder"
        />
      </Transition>
    </li>
  </ul>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
