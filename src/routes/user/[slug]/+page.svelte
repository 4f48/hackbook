<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	const { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>User: {data.user?.name}</h1>
{#if data.you != data.user?.id}
	<form method="POST" use:enhance>
		<button type="submit">
			{#if !data.followers}
				Follow
			{:else}
				Unfollow
			{/if}
		</button>
	</form>
{/if}
<p>{form?.error}</p>
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
