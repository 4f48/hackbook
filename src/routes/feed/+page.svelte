<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<h1>What's hackin'</h1>
<a href="/settings">user settings</a>
<a href="/new">post something</a>
<main class="flex w-full flex-col items-center gap-3">
	{#each data.results as post}
		<div class="flex w-[50%] flex-col content-center gap-3 border border-black p-3">
			<a href="/user/{post.author.id}">{post.author.name}</a>
			<a href="/post/{post.post.id}">{post.post.content}</a>
			{#if post.picture}
				<img class="border border-black" src={post.post.picture} alt="post pic" />
			{/if}
		</div>
	{/each}
</main>
