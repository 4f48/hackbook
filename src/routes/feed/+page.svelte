<script lang="ts">
	import type { PageData } from './$types';
	import Post from '$lib/Post.svelte';

	const { data }: { data: PageData } = $props();
</script>

<h1>What's hackin'</h1>
<a href="/settings">user settings</a>
<a href="/new">post something</a>
<div class="flex w-full justify-center">
	<main class="flex w-[50%] flex-col items-center justify-center gap-3">
		{#each data.results as post, index}
			<Post
				avatar={post.author.avatar as string | undefined}
				clickable="true"
				content={post.post.content}
				date={post.post.date}
				href={`/post/${post.post.id}`}
				index={index.toString()}
				picture={post.post.picture as string | undefined}
				userId={post.author.id}
				username={post.author.name}
			/>
		{/each}
	</main>
</div>
