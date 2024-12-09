<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDistanceToNow } from 'date-fns';
	import Avatar from '$lib/Avatar.svelte';
	// import Like from '$lib/icons/Like.svelte';
	// import Dislike from '$lib/icons/Dislike.svelte';

	interface Props {
		avatar?: string;
		clickable?: string;
		content: string;
		date: Date;
		href: string;
		image?: 'clickable' | 'static';
		index: string;
		// interacted?: 'liked' | 'disliked';
		// likes: string;
		picture?: string;
		userId: string;
		username: string;
	}

	const {
		avatar,
		clickable,
		content,
		date,
		href,
		image,
		index,
		// interacted,
		// likes,
		picture,
		userId,
		username
	}: Props = $props();

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter' || event.key == ' ') {
			goto(href);
		}
	}
</script>

<div
	class="flex w-full flex-col gap-2 rounded-lg border border-orange-300 p-4 transition-colors duration-200 {clickable ==
	'true'
		? 'cursor-pointer hover:bg-orange-200 focus:bg-orange-200 focus:outline-none'
		: ''}"
	tabindex={parseInt(index)}
	onkeydown={handleKeyDown}
	role="link"
	onclick={() => {
		goto(href);
	}}
>
	<div class="flex gap-2">
		<div>
			<div class="h-10 w-10"><Avatar {avatar} id={userId} name={username} /></div>
		</div>
		<div>
			<div class="flex items-center gap-1">
				<a href="/user/{userId}" class="font-semibold text-black no-underline hover:underline"
					>{username}</a
				>
				&#183;
				<p
					title="Posted on {new Date(date).toLocaleString(undefined, {
						dateStyle: 'long',
						timeStyle: 'short'
					})}"
					class="cursor-help text-sm text-gray-500"
				>
					{formatDistanceToNow(new Date(date), { addSuffix: true })}
				</p>
			</div>
			<p>
				{content}
			</p>
			{#if picture}
				{#if image == 'clickable'}
					<a href={picture}>
						<img
							class="mt-3 rounded-md border border-orange-300 duration-500 hover:border-orange-500"
							src={picture}
							alt="post pic"
						/>
					</a>
				{:else}
					<img class="mt-3 rounded-md border border-orange-300" src={picture} alt="post pic" />
				{/if}
			{/if}
			<!--
			<div class="flex gap-1">
				<form method="POST" action="?/like">
					<button type="submit"><Like color="rgb(249 115 22)" height="24px" /></button>
				</form>
				<form method="POST" action="?/dislike">
					<button type="submit"><Dislike color="rgb(249 115 22)" height="24px" /></button>
				</form>
				<p>{likes}</p>
			</div>
			-->
		</div>
	</div>
</div>
