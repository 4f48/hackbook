<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Avatar from '$lib/Avatar.svelte';
	import Button from '$lib/Button.svelte';
	import Post from '$lib/Post.svelte';
	import { enhance } from '$app/forms';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mb-12 flex h-[20vh] w-full items-center bg-orange-200">
	<div class="ml-12 flex items-center gap-2">
		<div class="h-[7vh] w-[7vh]">
			<Avatar id={data.user!.id} name={data.user!.name} avatar={data.user!.avatar!} />
		</div>
		<h1 class="text-3xl font-bold text-orange-500">{data.user?.name}</h1>
		{#if data.you != data.user?.id}
			<form method="POST" use:enhance class="pl-5">
				<Button type="submit">
					{#if !data.followers}
						Follow
					{:else}
						Unfollow
					{/if}
				</Button>
				<p class="font-bold text-red-500">{form?.error}</p>
			</form>
		{/if}
	</div>
</div>
<main class="flex w-full justify-center">
	<div class="flex w-[50%] flex-col gap-3">
		{#each data.userPosts as post, index}
			<Post
				avatar={data.user!.avatar!}
				clickable="true"
				content={post.content}
				date={post.date}
				href="/post/{post.id}"
				index={index.toString()}
				picture={post.picture!}
				userId={data.user!.id}
				username={data.user!.name}
			/>
		{/each}
	</div>
</main>
