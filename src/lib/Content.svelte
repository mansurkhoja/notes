<script lang="ts">
	import type { OutputData } from '@editorjs/editorjs'
	import Editor from './components/Editor.svelte'
	import { isSidebarOpen } from './ui'
	import { addNote, currentNoteId, setCurrentNoteId, updateNote } from './notes'

	let note: OutputData = {
		blocks: [],
	}

	async function handleUpdate(newData: OutputData) {
		if (newData.blocks.length && $currentNoteId === null) {
			const createdId = await addNote(JSON.stringify(newData))
			setCurrentNoteId(createdId)
		} else if ($currentNoteId) {
			updateNote($currentNoteId, JSON.stringify(newData))
		}
	}
</script>

<div class="content" class:hidden={$isSidebarOpen}>
	<Editor data={note} onUpdate={handleUpdate} />
	<pre>{JSON.stringify(note, null, 2)}</pre>
</div>

<style>
	.content {
		flex-grow: 1;
		padding: 80px 1rem 0.5rem;
		position: sticky;
		top: 0;
		min-height: calc(100svh - 80px - 0.5rem);
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
</style>
