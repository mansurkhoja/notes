import { writable } from 'svelte/store'

export const isSidebarOpen = writable(true)

export function toggleSidebar(): void {
	isSidebarOpen.update((isOpen) => !isOpen)
}

export function closeSidebar(): void {
	isSidebarOpen.set(false)
}

export function openSidebar(): void {
	isSidebarOpen.set(true)
}