<script lang="ts">
	import type { OutputData } from '@editorjs/editorjs'
	import Editor from './components/Editor.svelte'
	import { isSidebarOpen } from './ui'
	import {
		addNote,
		currentNoteId,
		notes,
		removeNote,
		setCurrentNoteId,
		updateNote,
	} from './notes'
	import AlertDialog from './components/AlertDialog.svelte'
	import Skeleton from './components/Skeleton.svelte'

	let editorInstance: any = $state(null)
	let isRemoveDialogOpen = $state(false)
	const emptyData: OutputData = {
		blocks: [],
	}

	export function loadNoteData(data: OutputData = emptyData) {
		if (editorInstance) {
			editorInstance.render(data).catch(() => {})
		}
	}

	let isAddingNote = false
	let isRemovingNote = false

	async function handleUpdate(newData: OutputData) {
		const stringData = JSON.stringify(newData)
		if (newData.blocks.length && $currentNoteId === null) {
			if (isAddingNote) return
			isAddingNote = true
			const createdId = await addNote(stringData)
			setCurrentNoteId(createdId)
		} else if ($currentNoteId) {
			updateNote($currentNoteId, stringData)
		}
	}

	async function handleRemove() {
		if ($currentNoteId === null || isRemovingNote) return
		isRemovingNote = true
		await removeNote($currentNoteId)
		loadNoteData()
		setCurrentNoteId(null)
		isRemoveDialogOpen = false
		isRemovingNote = false
	}
</script>

<div class="content" class:hidden={$isSidebarOpen}>
	{#if $notes === undefined}
		<div class="skeleton">
			<Skeleton />
		</div>
	{:else}
		<Editor bind:instance={editorInstance} onUpdate={handleUpdate} />
		{#if $currentNoteId !== null}
			<div class="remove-btn">
				<AlertDialog
					onConfirm={handleRemove}
					confirmText="Delete"
					cancelText="Cancel"
					bind:open={isRemoveDialogOpen}
				>
					{#snippet buttonText()}
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M10.6299 1.33496C12.0335 1.33496 13.2695 2.25996 13.666 3.60645L13.8809 4.33496H17L17.1338 4.34863C17.4369 4.41057 17.665 4.67858 17.665 5C17.665 5.32142 17.4369 5.58943 17.1338 5.65137L17 5.66504H16.6543L15.8574 14.9912C15.7177 16.629 14.3478 17.8877 12.7041 17.8877H7.2959C5.75502 17.8877 4.45439 16.7815 4.18262 15.2939L4.14258 14.9912L3.34668 5.66504H3C2.63273 5.66504 2.33496 5.36727 2.33496 5C2.33496 4.63273 2.63273 4.33496 3 4.33496H6.11914L6.33398 3.60645L6.41797 3.3584C6.88565 2.14747 8.05427 1.33496 9.37012 1.33496H10.6299ZM5.46777 14.8779L5.49121 15.0537C5.64881 15.9161 6.40256 16.5576 7.2959 16.5576H12.7041C13.6571 16.5576 14.4512 15.8275 14.5322 14.8779L15.3193 5.66504H4.68164L5.46777 14.8779ZM7.66797 12.8271V8.66016C7.66797 8.29299 7.96588 7.99528 8.33301 7.99512C8.70028 7.99512 8.99805 8.29289 8.99805 8.66016V12.8271C8.99779 13.1942 8.70012 13.4912 8.33301 13.4912C7.96604 13.491 7.66823 13.1941 7.66797 12.8271ZM11.002 12.8271V8.66016C11.002 8.29289 11.2997 7.99512 11.667 7.99512C12.0341 7.9953 12.332 8.293 12.332 8.66016V12.8271C12.3318 13.1941 12.0339 13.491 11.667 13.4912C11.2999 13.4912 11.0022 13.1942 11.002 12.8271ZM9.37012 2.66504C8.60726 2.66504 7.92938 3.13589 7.6582 3.83789L7.60938 3.98145L7.50586 4.33496H12.4941L12.3906 3.98145C12.1607 3.20084 11.4437 2.66504 10.6299 2.66504H9.37012Z"
							>
							</path>
						</svg>
						Delete
					{/snippet}
					{#snippet title()}
						Delete Note?
					{/snippet}
					{#snippet description()}
						This action cannot be undone. This will permanently delete the note.
					{/snippet}
				</AlertDialog>
			</div>
		{/if}
	{/if}

	<!-- <pre>{(JSON.stringify(note, null, 2))}</pre> -->
</div>

<style>
	.content {
		flex-grow: 1;
		padding: 80px 1rem 0.5rem;
		position: sticky;
		top: 0;
		min-height: calc(100svh - 80px - 0.5rem);
	}

	.remove-btn {
		margin-top: 10px;
		display: flex;
		justify-content: flex-end;
	}

	.remove-btn :global(button) {
		background-color: rgb(245, 89, 89);
	}

	@media screen and (max-width: 900px) {
		.content {
			padding-bottom: calc(42px + 0.5rem);
			min-height: calc(100svh - 80px - 42px - 0.5rem);
		}

		.content.hidden {
			display: none;
		}
	}

	.skeleton {
		height: 200px;
		width: 100%;
	}
</style>
