<script lang="ts">
	import { AlertDialog, type WithoutChild } from 'bits-ui'
	import type { Snippet } from 'svelte'

	type Props = AlertDialog.RootProps & {
		buttonText?: string | Snippet
		confirmText?: string | Snippet
		cancelText?: string | Snippet
		title: Snippet
		description: Snippet
		contentProps?: WithoutChild<AlertDialog.ContentProps>
		onConfirm?: () => void
	}

	let {
		open = $bindable(false),
		children,
		buttonText,
		confirmText,
		cancelText,
		contentProps,
		title,
		description,
		onConfirm,
		...restProps
	}: Props = $props()
</script>

<AlertDialog.Root bind:open {...restProps}>
	{#if buttonText}
		<AlertDialog.Trigger>
			{#if typeof buttonText === 'function'}
				{@render (buttonText as Snippet)()}
			{:else}
				{buttonText}
			{/if}
		</AlertDialog.Trigger>
	{/if}
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="dialog-overlay" />
		<AlertDialog.Content
			escapeKeydownBehavior="ignore"
			class="dialog-content"
			{...contentProps}
		>
			<div class="dialog-header">
				<AlertDialog.Title class="dialog-title">
					{@render title()}
				</AlertDialog.Title>
				<AlertDialog.Description class="dialog-description">
					{@render description()}
				</AlertDialog.Description>
			</div>
			{@render children?.()}
			<div class="dialog-actions">
				{#if cancelText}
					<AlertDialog.Cancel>
						{#if typeof cancelText === 'function'}
							{@render (cancelText as Snippet)()}
						{:else}
							{cancelText}
						{/if}
					</AlertDialog.Cancel>
				{/if}
				{#if confirmText}
					<AlertDialog.Action onclick={onConfirm}>
						{#if typeof confirmText === 'function'}
							{@render (confirmText as Snippet)()}
						{:else}
							{confirmText}
						{/if}
					</AlertDialog.Action>
				{/if}
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>