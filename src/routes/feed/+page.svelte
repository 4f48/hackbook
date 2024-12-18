<script lang="ts">
	import type { PageData } from './$types';
	import Post from '$lib/Post.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import { enhance } from '$app/forms';

	const { data }: { data: PageData } = $props();
</script>

<div class="flex w-full justify-center">
	<main class="flex w-full flex-col items-center justify-center gap-3">
		{#if data.results.length > 0}
			<div class="mx-5 lg:w-[50%] items-center gap-3 flex-col flex last:mb-3">
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
			</div>
		{:else}
			<div class="flex h-[90vh] w-full items-center justify-center">
				<form
					class="mx-5 flex w-full flex-col gap-1 rounded-xl bg-orange-200 p-7 sm:mx-0 sm:w-[50vw] lg:w-[28vw]"
					use:enhance
					method="POST"
					action="/search"
				>
					<h1 class="text-xl font-bold text-orange-500">It's so empty in here...</h1>
					<p class="mb-3 text-justify">
						This is your following feed, where posts from people you follow show up. Start following
						people to see their posts.
					</p>
					<label for="search" class="text-orange-500">Search hackers</label>
					<Input id="search" name="search" required />
					<Button type="submit">Search</Button>
				</form>
			</div>
		{/if}
	</main>
</div>
