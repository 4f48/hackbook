<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<h3>Hackers named {data.search}</h3>
<div class="flex flex-col gap-3 p-3">
	{#each data.results as user}
		<div class="border border-black p-3">
			<a href="/user/{user.id}">{user.name}</a>
		</div>
	{/each}
</div>
