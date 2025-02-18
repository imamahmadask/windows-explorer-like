<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { Folder as FolderIcon } from 'lucide-vue-next'
import axios from 'axios'
import FolderTree from './FolderTree.vue'
import type { Folder } from '../types/folder'

const API_BASE_URL = 'http://localhost:3000/api'

const folderStructure = ref<Folder[]>([])
const selectedFolder = ref<Folder | null>(null)

// Provide the selectedFolder to child components
provide('selectedFolder', selectedFolder)

// Fetch folder structure from the backend
const fetchFolderStructure = async (): Promise<Folder[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/folders`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch folder structure:', error)
    throw error
  }
}

// Fetch subfolders from the backend
const fetchSubfolders = async (folderId: number): Promise<Folder[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/folders/${folderId}/subfolders`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch subfolders for folder ${folderId}:`, error)
    throw error
  }
}

const selectFolder = async (folder: Folder) => {
  selectedFolder.value = folder
  // Fetch subfolders when a folder is selected
  if (!folder.subfolders) {
    try {
      folder.subfolders = await fetchSubfolders(folder.id)
    } catch (error) {
      console.error(`Failed to fetch subfolders for folder ${folder.id}:`, error)
      folder.subfolders = []
    }
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
