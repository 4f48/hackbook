<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<h1>User: {data.user?.name}</h1>
<main class="flex w-full flex-col items-center gap-3">
	{#each data.userPosts as post}
		<div class="flex w-[50%] flex-col content-center gap-3 border border-black p-3">
			<a href="/user/{data.user?.id}">{data.user?.name}</a>
			<a href="/post/{post.id}">{post.content}</a>
			{#if post.picture}
				<img class="border border-black" src={post.picture} alt="post pic" />
			{/if}
		</div>
	{/each}
</main>
