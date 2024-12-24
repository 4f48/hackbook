<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Post from '$lib/Post.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import { page } from '$app/state';

	const { data }: { data: PageData } = $props();
</script>

<div class="flex w-full justify-center">
	<div class="flex w-[50%] flex-col gap-3">
		<article class="mb-2">
			<Post
				avatar={data.post.author.avatar!}
				content={data.post.content}
				currentUser={data.currentUser}
				date={data.post.date}
				href={page.url.href}
				index="0"
				liked={data.post.isLiked}
				likes={data.post.likesCount.toString()}
				picture={data.post.picture!}
				postId={data.post.id}
				userId={data.post.author.id}
				username={data.post.author.name}
			/>
		</article>
		<form method="POST" use:enhance class="flex gap-1">
			<span class="flex-[8]"
				><Input placeholder="Comment..." name="content" required maxlength="300" /></span
			>
			<span class="flex-[2]"><Button>Comment</Button></span>
		</form>
		<div class="flex flex-col gap-1">
			{#each data.comments as comment, index}
				<Post
					avatar={comment.author.avatar!}
					content={comment.content}
					date={comment.date}
					href={page.url.href!}
					index={(index + 1).toString()}
					userId={comment.authorId}
					username={comment.author.name!}
				/>
			{/each}
		</div>
	</div>
</div>
