<script lang="ts">
	import { onMount } from 'svelte'
	import EditorJS from '@editorjs/editorjs'
	import Header from '@editorjs/header'
	import Marker from '@editorjs/marker'
	import RawTool from '@editorjs/raw'
	import EditorjsList from '@editorjs/list'
	import type { OutputData } from '@editorjs/editorjs'

	let editorContainer: HTMLDivElement
	let editor: EditorJS | null = null
	let isReady = $state(false)
	// interface Props {
	// 	data: OutputData
	// 	// onUpdate: (data: OutputData) => void
	// }

	let {
		onUpdate = (data: OutputData) => {},
		instance = $bindable(null) as EditorJS | null,
	} = $props()

	onMount(() => {
		editor = new EditorJS({
			holder: editorContainer,
			placeholder: 'Start writing your note...',
			tools: {
				header: {
					class: Header,
					inlineToolbar: false,
				} as any,
				marker: Marker,
				raw: RawTool,
				List: {
					class: EditorjsList,
					inlineToolbar: true,
					config: {
						defaultStyle: 'unordered',
					},
				},
			},
			data: {
				blocks: [],
			},
			onReady: () => {
				isReady = true
				instance = editor
			},
			onChange: async () => {
				if (!editor) return

				try {
					const outputData: OutputData = await editor.save()
					onUpdate?.(outputData)
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
	// 	console.log('effect data')
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

	@media (min-width: 900px) {
		:global(.ce-block__content),
		:global(.ce-toolbar__content) {
			/* max-width: none !important; */
			max-width: calc(100% - 120px) !important;
		}
	}

	:global(.ce-paragraph),
	:global(.ce-header) {
		padding: 0.4em !important;
	}

	:global(.cdx-notifies) {
		color: #999;
	}

	:global(.ce-inline-tool-input) {
		color: #000;
	}
</style>
