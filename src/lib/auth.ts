import {
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type User,
} from 'firebase/auth'
import { writable, type Readable } from 'svelte/store'
import { getFirebaseAuth, getGoogleProvider } from './firebase'

// 1. Use the writable store to manage the user state
const userWritable = writable<User | null>(undefined) // Initialize with undefined or null to signify loading/no user

let unsubscribeAuth: (() => void) | null = null

// 2. Function to start the auth listener and update the store
export function startAuthListener(): void {
	if (unsubscribeAuth) return // Prevent starting multiple listeners
	const auth = getFirebaseAuth()
	unsubscribeAuth = onAuthStateChanged(auth, u => {
		// Update the Svelte store with the user object
		userWritable.set(u)
	})
}

// 3. Function to stop the auth listener (important for cleanup, especially in SPAs)
export function stopAuthListener(): void {
	if (unsubscribeAuth) {
		unsubscribeAuth()
		unsubscribeAuth = null
	}
}

// 4. Export a readable version of the user store for components to subscribe to
export const currentUser: Readable<User | null> = {
	subscribe: userWritable.subscribe,
}

// 5. Asynchronous function to handle Google Sign-In
export async function signInWithGoogle(): Promise<User> {
	const auth = getFirebaseAuth()
	const provider = getGoogleProvider()
	const result = await signInWithPopup(auth, provider)
	if (!result.user) throw new Error('No user returned from Google sign-in')
	return result.user
}

// 6. Asynchronous function to handle signing out
export async function signOutUser(): Promise<void> {
	const auth = getFirebaseAuth()
	await signOut(auth)
}
