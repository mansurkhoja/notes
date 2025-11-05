import { get, writable, type Readable } from 'svelte/store'
import {
	collection,
	query,
	onSnapshot,
	orderBy,
	type DocumentData,
	type QueryDocumentSnapshot,
	type Unsubscribe,
	addDoc,
	updateDoc,
	Timestamp,
	DocumentReference,
	doc,
	deleteDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { currentUser } from './auth'
import type { OutputData } from '@editorjs/editorjs'

// Define the interface for Note documents
export interface Note {
	id: string
	data: OutputData
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

				fetchedNotes.forEach(async note => {
					const id = note.id
					if (typeof note.data === 'string') {
						note.data = JSON.parse(note.data) as OutputData
					}
					if (get(currentNoteId) !== id) {
						if (note.data.blocks.length === 0) {
							await removeNote(id)
						}
					}
				})

				notesWritable.set(fetchedNotes) // Update the Svelte store
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

// Add a new note (for completeness)
export async function addNote(data: string): Promise<string> {
	if (!currentUserId) {
		throw new Error("No authenticated user to add a note.")
	}
	const docRef: DocumentReference = await addDoc(collection(db, 'users', currentUserId, 'notes'), {
		data,
		createdAt: Timestamp.now()
	})

	console.log(`Note with ID: ${docRef.id} created successfully.`)

	return docRef.id
}

// Update an existing note
export async function updateNote(noteId: string, newData: string): Promise<void> {
	if (!currentUserId) {
		throw new Error("No authenticated user to update a note.")
	}

	const noteRef = doc(db, 'users', currentUserId, 'notes', noteId)

	await updateDoc(noteRef, {
		data: newData,
		updatedAt: Timestamp.now()
	})

	console.log(`Note with ID: ${noteId} updated successfully.`)
}

// Remove a note
export async function removeNote(noteId: string): Promise<void> {
	if (!currentUserId) {
		throw new Error("No authenticated user to remove a note.")
	}

	const noteRef = doc(db, 'users', currentUserId, 'notes', noteId)

	await deleteDoc(noteRef)

	console.log(`Note with ID: ${noteId} removed successfully.`)
}

// Get a note by ID
export function getNoteById(id: string): Note | undefined {
	return get(notes)?.find(note => note.id === id)
}