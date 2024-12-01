<script lang="ts">
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
</script>

<h3>Hackers named {data.search}</h3>
{#each data.results as user}
	<div>
		<a href="/user/{user.id}">{user.name}</a>
	</div>
{/each}
