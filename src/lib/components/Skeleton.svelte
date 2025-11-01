<div class="skeleton"></div>

<style>
	.skeleton {
		width: 100%;
		height: 100%;
		background: rgba(223, 223, 223, 0.15);
		border-radius: 0.5rem;
		animation: pulse 0.8s infinite;

		&:nth-child(odd) {
			animation-delay: 0.4s;
		}
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>
