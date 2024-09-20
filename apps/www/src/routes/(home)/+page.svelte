<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let compression = $state(50);
	let loading = $state(false);

	$effect(() => {
		const abortController = new AbortController();

		if (form && form.success) {
			fetchAndDownloadImage(form.result.imageUrl, abortController.signal);
		}

		return () => {
			abortController.abort();
		};
	});

	async function fetchAndDownloadImage(url, signal) {
		try {
			const response = await fetch(url, { signal });
			const blob = await response.blob();
			const _url = URL.createObjectURL(blob);
			download(_url);
		} catch (error) {
			console.error(error);
		}
	}

	function download(url) {
		const a = document.createElement('a');
		a.href = url;
		a.target = '_blank';
		a.download = 'image.jpg';
		a.click();
	}
</script>

<form
	class="form"
	method="POST"
	enctype="multipart/form-data"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
		};
	}}
>
	<div class="form-group">
		<label for="image" class="form-label">Select an image</label>
		<input type="file" id="image" name="image" required />
	</div>

	<div class="form-group">
		<label for="compression" class="form-label">Compression ({compression})%</label>
		<input
			type="range"
			id="compression"
			name="compression"
			required
			bind:value={compression}
			min={10}
			max={90}
		/>
	</div>

	<div class="form-group">
		<button class="button" type="submit" disabled={loading}>
			{#if loading}
				Resizing...
			{:else}
				Resize
			{/if}
		</button>
	</div>
</form>

{#if form}
	<div class="form-message">
		{#if form.success}
			<p>Image resized successfully</p>
		{:else}
			<p>Filed to resize image</p>
		{/if}
	</div>
{/if}

<style>
	.form {
		&:not(:last-child) {
			margin-bottom: 1rem;
		}

		& .form-group {
			display: flex;
			align-items: center;
			gap: 1rem;

			&:not(:last-child) {
				margin-bottom: 1rem;
			}
		}
	}

	.button {
		width: 320px;
	}
</style>
