<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	const { data }: { data: PageData } = $props();
</script>

<div class="flex w-[50%] flex-col content-center gap-3 border border-black p-3">
	<a href="/user/{data.post.authorId}">{data.post.author}</a>
	<p>{data.post.content}</p>
	{#if data.post.picture}
		<img class="border border-black" src={data.post.picture} alt="post pic" />
	{/if}
</div>
<form method="POST" use:enhance>
	<label for="content">Content</label>
	<input id="content" name="content" required maxlength="300" />
	<button type="submit">Comment</button>
</form>
{#each data.postComments as comment}
	<div class="flex w-[50%] flex-col content-center gap-3 border border-black p-3">
		<a href="/user/{comment.authorId}">{comment.author}</a>
		<p>{comment.content}</p>
	</div>
{/each}
