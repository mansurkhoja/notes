<script lang="ts">
	import EditorJS from '@editorjs/editorjs'
	import Header from '@editorjs/header'
	import Marker from '@editorjs/marker'

	import { onMount } from 'svelte'

	let editorContainer: HTMLDivElement
	let editor: EditorJS | null = null

	onMount(() => {
		editor = new EditorJS({
			/**
			 * Id of Element that should contain the Editor
			 */
			holder: editorContainer,
			inlineToolbar: ['bold', 'italic', 'link', 'marker'],

			/**
			 * Available Tools list.
			 * Pass Tool's class or Settings object for each Tool you want to use
			 */
			tools: {
				header: {
					class: Header,
					inlineToolbar: ['marker', 'link', 'bold'],
				} as any,
				marker: Marker,
			},
			/**
			 * Previously saved data that should be rendered
			 */
			data: {
				blocks: [],
			},

			placeholder: 'Let`s write an awesome story!',

			/**
			 * onReady callback
			 */
			onReady: () => {
				console.log('Editor.js is ready to work!')
			},

			/**
			 * onChange callback
			 */
			onChange: (api, event) => {
				console.log("Now I know that Editor's content changed!", event)
			},
		})

		return () => {
			if (editor && typeof editor.destroy === 'function') {
				editor.destroy()
			}
		}
	})
</script>

<div bind:this={editorContainer} class="editor"></div>

<style>
	:global(.codex-editor) {
		font-family: inherit;
	}

	:global(.codex-editor__redactor) {
		padding-bottom: 0 !important;
	}

	:global(.ce-block__content) {
		max-width: none !important;
	}
</style>
