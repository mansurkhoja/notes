<script lang="ts">
	import { onMount } from 'svelte'
	import EditorJS from '@editorjs/editorjs'
	import Header from '@editorjs/header'
	import Marker from '@editorjs/marker'
	import Link from '@editorjs/link'
	import type { OutputData } from '@editorjs/editorjs'

	let editorContainer: HTMLDivElement
	let editor: EditorJS | null = null
	let isReady = $state(false)

	interface Props {
		data: OutputData
		// onUpdate: (data: OutputData) => void
	}

	let {
		data = {
			time: Date.now(),
			blocks: [],
			version: '2.31.0',
		},
	}: Props = $props()

	onMount(() => {
		editor = new EditorJS({
			holder: editorContainer,
			placeholder: 'Start writing your note...',
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
				} as any,
				marker: Marker,
				linkTool: Link,
			},
			data,
			onReady: () => {
				isReady = true
			},
			onChange: async (api, event) => {
				console.log('Content changed!', event)

				if (!editor) return

				try {
					const outputData: OutputData = await editor.save()
					console.log('Article data: ', outputData)
					console.log(JSON.stringify(outputData))
				} catch (error) {
					console.log('Saving failed: ', error)
				}
			},
		})

		return () => {
			if (editor && typeof editor.destroy === 'function') {
				editor.destroy()
			}
		}
	})

	// $effect(() => {
	// 	if (!editor || !isReady) return
	// 	editor.render(data)
	// 	console.log('2effect data')
	// })
</script>

<div bind:this={editorContainer} class="editor"></div>

<style>
	.editor {
		width: 100%;
		border-radius: 4px;
		min-width: 300px;
		min-height: 200px;
		color: #000;
		background-color: #fff;
	}

	:global(.codex-editor) {
		font-family: inherit;
	}

	:global(.codex-editor__redactor) {
		padding-bottom: 0 !important;
	}

	:global(.ce-block__content) {
		max-width: none !important;
	}

	:global(.ce-paragraph),
	:global(.ce-header) {
		padding: 0.4em !important;
	}
</style>
