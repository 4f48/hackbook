<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDistanceToNow } from 'date-fns';
	import Avatar from '$lib/Avatar.svelte';
	import Like from '$lib/icons/Like.svelte';
	import Liked from '$lib/icons/Liked.svelte';

	interface Props {
		avatar?: string;
		clickable?: string;
		content: string;
		currentUser?: string;
		date: Date;
		href: string;
		image?: 'clickable' | 'static';
		index: string;
		liked?: boolean;
		likes?: string;
		picture?: string;
		postId?: string;
		userId: string;
		username: string;
	}

	const {
		avatar,
		clickable,
		content,
		currentUser,
		date,
		href,
		image,
		index,
		liked,
		likes,
		picture,
		postId,
		userId,
		username
	}: Props = $props();

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter' || event.key == ' ') {
			goto(href);
		}
	}

	let likedLocal = $state(liked);
	let likesLocal = $state(likes);

	async function handleClick() {
		const response = await fetch('/api/like', {
			method: 'POST',
			body: JSON.stringify({ postId, userId: currentUser })
		});
		if (response.status == 200) {
			if (likedLocal) {
				likedLocal = false;
				likesLocal = (parseInt(likesLocal!) - 1).toString();
			} else {
				likedLocal = true;
				likesLocal = (parseInt(likesLocal!) + 1).toString();
			}
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
					class="curs%d : %nor-help text-sm text-gray-500"
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
			{#if !clickable && postId}
				<div class="mt-2 flex items-center gap-1">
					<button
						onclick={(event) => {
							event.preventDefault();
							handleClick();
						}}
						aria-label="like"
					>
						{#if likedLocal == true}
							<Liked color="rgb(249 115 22)" height="24px" />
						{:else}
							<Like color="rgb(249 115 22)" height="24px" />
						{/if}
					</button>
					<p>{likesLocal}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
