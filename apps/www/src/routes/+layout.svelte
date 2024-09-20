<script>
	import '../styles/app.css';

	let { children } = $props();
</script>

<div>
	<header>
		<a class="link" href="/">Image Resizer</a>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	div {
		height: 100%;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	header {
		height: 4rem;
		display: flex;
		align-items: center;
		background-color: #222;
		padding: 0 1rem;

		& .link {
			color: white;
			text-decoration: none;
			font-size: 1rem;
			font-weight: 400;
		}
	}

	main {
		flex-grow: 1;
		padding: 0 1rem;
	}
</style>
