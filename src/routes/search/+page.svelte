<script lang="ts">
	import Avatar from '$lib/Avatar.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<div class="flex w-full justify-center">
	<main class="flex w-[50%] flex-col gap-3 p-3">
		{#each data.results as user}
			<div class="flex w-full items-center gap-3 rounded-xl border border-orange-300 p-3">
				<span class="h-10 w-10">
					<Avatar avatar={user.avatar!} id={user.id} name={user.name} />
				</span>
				<a href="/user/{user.id}">{user.name}</a>
			</div>
		{/each}
		<p class="text-center text-sm font-light text-orange-500">
			Found {data.results.length} result{data.results.length > 1 ? 's' : ''}
		</p>
	</main>
</div>
