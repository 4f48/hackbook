<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import Input from '$lib/Input.svelte';
	import type { Snippet } from 'svelte';
	import Button from '$lib/Button.svelte';
	import { enhance } from '$app/forms';

	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	injectAnalytics();
	injectSpeedInsights();

	import Loader from '$lib/Loader.svelte';
	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<Loader />

<header
	class="sticky top-0 flex w-full justify-center bg-orange-100 bg-opacity-10 px-5 py-1 backdrop-blur-sm backdrop-filter"
>
	<nav class="flex flex-1 items-center gap-3">
		<a class="text-orange-500 no-underline hover:underline" href="/feed"
			><h1 class="text-xl font-bold text-orange-500">Hackbook</h1></a
		>
		<span class="select-none text-orange-500">&#183;</span>
		{#if data.uuid}
			<a class="text-orange-500 no-underline hover:underline" href="/user/{data.uuid}">Your posts</a
			>
			<span class="select-none text-orange-500">&#183;</span>
			<a class="text-orange-500 no-underline hover:underline" href="/settings">Settings</a>
		{:else}
			<a class="text-orange-500 no-underline hover:underline" href="/signup">Sign up</a>
			<span class="select-none text-orange-500">&#183;</span>
			<a class="text-orange-500 no-underline hover:underline" href="/">Sign in</a>
		{/if}
	</nav>
	{#if data.uuid}
		<div class="flex w-[30%] gap-2">
			<a class="flex-[2]" href="/new"><Button>New post...</Button></a>
			<form method="POST" action="/search" class="w-[30%] flex-[8]" use:enhance>
				<Input placeholder="Search hackers..." name="search" required />
			</form>
		</div>
	{/if}
</header>
{@render children()}
