<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { Folder as FolderIcon } from 'lucide-vue-next'
import FolderTree from './FolderTree.vue'
import type { Folder } from '../types/folder'
import { dummyFolderStructure } from '../data/dummyData'

const folderStructure = ref<Folder[]>([])
const selectedFolder = ref<Folder | null>(null)

// Provide the selectedFolder to child components
provide('selectedFolder', selectedFolder)

// Simulate API call to fetch folder structure
const fetchFolderStructure = async (): Promise<Folder[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return dummyFolderStructure
}

// Simulate API call to fetch subfolders
const fetchSubfolders = async (folderId: number): Promise<Folder[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the folder in the structure and return its subfolders
  const findFolder = (folders: Folder[]): Folder | undefined => {
    for (const folder of folders) {
      if (folder.id === folderId) return folder
      if (folder.subfolders) {
        const found = findFolder(folder.subfolders)
        if (found) return found
      }
    }
  }

  const folder = findFolder(dummyFolderStructure)
  return folder?.subfolders || []
}

const selectFolder = async (folder: Folder) => {
  selectedFolder.value = folder
  // Fetch subfolders when a folder is selected
  if (!folder.subfolders) {
    folder.subfolders = await fetchSubfolders(folder.id)
  }
}

onMounted(async () => {
  try {
    folderStructure.value = await fetchFolderStructure()
  } catch (error) {
    console.error('Failed to fetch folder structure:', error)
    // Handle error (e.g., show error message to user)
  }
})
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left panel: Complete folder structure -->
    <div class="w-1/3 bg-gray-200 p-4 overflow-y-auto">
      <h2 class="text-lg font-semibold mb-4">Folder Structure</h2>
      <div class="folder-tree">
        <Suspense>
          <FolderTree :folders="folderStructure" @select-folder="selectFolder" />
          <template #fallback>
            <div class="text-center text-gray-500 mt-8">Loading folder structure...</div>
          </template>
        </Suspense>
      </div>
    </div>

    <!-- Right panel: Direct subfolders of selected folder -->
    <div class="flex-1 flex flex-col">
      <div class="bg-white p-4 shadow">
        <h2 class="text-lg font-semibold">{{ selectedFolder?.name ?? 'Select a folder' }}</h2>
      </div>
      <div class="flex-1 p-4 overflow-y-auto">
        <div
          v-if="selectedFolder?.subfolders"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <div
            v-for="subfolder in selectedFolder.subfolders"
            :key="subfolder.id"
            class="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-200 rounded"
            @click="selectFolder(subfolder)"
          >
            <FolderIcon class="text-4xl text-yellow-500" />
            <span class="mt-2 text-center text-sm">{{ subfolder.name }}</span>
          </div>
        </div>
        <div v-else-if="selectedFolder" class="text-center text-gray-500 mt-8">
          This folder is empty
        </div>
        <div v-else class="text-center text-gray-500 mt-8">
          Select a folder to view its contents
        </div>
      </div>
    </div>
  </div>
</template>
