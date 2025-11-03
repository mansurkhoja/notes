<script lang="ts">
	import Editor from './components/Editor.svelte'
	import { isSidebarOpen } from './ui'
</script>

<div class="content" class:hidden={$isSidebarOpen}>
	<Editor />
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
