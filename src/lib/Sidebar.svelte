<script lang="ts">
	import Skeleton from './components/Skeleton.svelte'
	import { currentNoteId, notes, setCurrentNoteId } from './notes'
	import { isSidebarOpen } from './ui'
</script>

<div class="sidebar" class:hidden={!$isSidebarOpen}>
	{#if $notes === undefined}
		{#each Array(15) as _}
			<div class="skeleton">
				<Skeleton />
			</div>
		{/each}
	{:else}
		<div class="notes-list">
			<button class="note-link note-link--create flex column">
				<div class="title">New note</div>
			</button>
			{#each $notes as note}
				<button
					class="note-link flex column"
					class:active={$currentNoteId === note.id}
					onclick={() => setCurrentNoteId(note.id)}
				>
					<div class="title">note.title</div>
					<div class="sub-title">No additional text</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.sidebar {
		max-width: 300px;
		padding: 80px 1rem 0.5rem;
		background-color: #242424;
		width: 100%;
	}

	.notes-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.note-link {
		appearance: none;
		background: transparent;
		border: none;
		border-radius: 0.75rem;
		color: #f5f5f5;
		padding: 0.75rem 1rem;
		user-select: none;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
		border: 1px solid transparent;
		outline: none;
	}

	.note-link--create {
		color: #bbffa8;
		background: rgba(245, 245, 245, 0.05);
		border-color: rgba(245, 245, 245, 0.1);
	}

	@media (hover: hover) {
		button:hover {
			background: rgba(245, 245, 245, 0.05);
			border-color: rgba(245, 245, 245, 0.1);
		}
	}

	@media (hover: none) {
		button:active {
			background: rgba(245, 245, 245, 0.05);
			border-color: rgba(245, 245, 245, 0.1);
		}
	}

	.note-link.active {
		background: rgba(100, 108, 255, 0.1);
		border-color: rgba(100, 108, 255, 0.3);
		pointer-events: none;
	}

	.title {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.sub-title {
		font-size: 0.875rem;
		color: #a0a0a0;
		line-height: 1.3;
	}

	.skeleton {
		height: 48px;
		margin-bottom: 0.5rem;

		&:nth-child(odd) :global(div) {
			animation-delay: 0.1s;
		}
	}

	@media screen and (max-width: 900px) {
		.sidebar {
			padding-bottom: calc(42px + 0.5rem);
			max-width: initial;
		}

		.sidebar.hidden {
			display: none;
		}

		.note-link {
			padding: 0.5rem 0.75rem;
			border-radius: 0.5rem;
		}

		.skeleton {
			height: 38px;
		}
	}
</style>
