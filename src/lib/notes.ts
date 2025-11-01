import { writable, type Readable } from 'svelte/store'
import {
	collection,
	query,
	onSnapshot,
	orderBy,
	type DocumentData,
	type QueryDocumentSnapshot,
	type Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'
import { currentUser } from './auth'

// Define the interface for Note documents
export interface Note {
	id: string
	data: string
	createdAt: Date
}

const notesWritable = writable<Note[] | undefined>(undefined) // Start as undefined to indicate loading
const currentNoteIdWritable = writable<string | null>(null)
let unsubscribeNotes: Unsubscribe | null = null
let currentUserId: string | null = null

// Export a readable store for components to subscribe to
export const notes: Readable<Note[] | undefined> = {
	subscribe: notesWritable.subscribe
}

export const currentNoteId: Readable<string | null> = {
	subscribe: currentNoteIdWritable.subscribe
}

// Function to start listening for notes
export function startNotesListener(): void {
	// Only start if a user is logged in AND we haven't started listening yet
	if (currentUserId && !unsubscribeNotes) {
		const notesCollectionRef = collection(db, 'users', currentUserId, 'notes')
		const q = query(notesCollectionRef, orderBy('createdAt', 'desc')) // Example: order by creation date

		unsubscribeNotes = onSnapshot(
			q,
			(querySnapshot) => {
				const fetchedNotes: Note[] = []
				querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
					fetchedNotes.push({
						id: doc.id,
						...doc.data() as Omit<Note, 'id'>, // Type assertion for the document data
						createdAt: doc.data().createdAt?.toDate() // Convert Firestore Timestamp to JS Date
					})
				})
				notesWritable.set(fetchedNotes) // Update the Svelte store
				console.log({ fetchedNotes })
			},
			(error) => {
				console.error("Error listening to notes:", error)
				notesWritable.set([]) // Clear notes or set to an empty array on error
			}
		)
	} else if (!currentUserId && unsubscribeNotes) {
		// If user logs out, stop listening
		stopNotesListener()
		notesWritable.set(undefined) // Reset state
	}
}

// Function to stop listening for notes
export function stopNotesListener(): void {
	if (unsubscribeNotes) {
		unsubscribeNotes()
		unsubscribeNotes = null
	}
}

// Reactively update currentUserId and manage listener when currentUser store changes
currentUser.subscribe(user => {
	const newUserId = user?.uid || null
	if (newUserId !== currentUserId) {
		currentUserId = newUserId
		// Stop previous listener if user changed or logged out
		if (unsubscribeNotes) {
			stopNotesListener()
		}
		// Start new listener if a user is now logged in
		startNotesListener()
	}
})

// Function to set the current note ID
export function setCurrentNoteId(noteId: string | null): void {
	currentNoteIdWritable.set(noteId)
}
