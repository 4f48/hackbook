<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	let { form }: { form: ActionData } = $props();

	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';

	const postSignup = page.url.searchParams.has('post_signup');
	const unauthenticated = page.url.searchParams.has('unauthenticated');
	const loggedOut = page.url.searchParams.has('logged_out');

	let visible = $state(false);
	let progress = tweened(100);

	if (postSignup || unauthenticated || loggedOut) {
		onMount(() => {
			const params = new URLSearchParams(page.url.searchParams);
			if (postSignup) params.delete('post_signup');
			if (unauthenticated) params.delete('unauthenticated');
			if (loggedOut) params.delete('logged_out');
			goto(`?${params}`);

			visible = true;
			progress.set(0, { duration: 3000 });
			setTimeout(() => {
				visible = false;
			}, 3000);
		});
	}
</script>

<main>
	<div class="flex h-[90vh] w-full items-center justify-center">
		<form
			method="POST"
			use:enhance
			class="mx-5 flex w-full flex-col gap-1 rounded-xl bg-orange-200 p-7 sm:mx-0 sm:w-[50vw] md:w-[28vw]"
		>
			<h1 class="mb-3 text-xl font-bold text-orange-500">Sign in to Hackbook</h1>
			<label for="email" class="text-orange-500">Email address</label>
			<Input id="email" name="email" type="email" required />

			<label for="name" class="text-orange-500">Password</label>
			<Input id="password" name="password" type="password" required />

			<Button type="submit">Sign in</Button>
			<p class="text-center text-sm text-orange-400">
				Don't have an account? <a href="/signup" class="text-blue-400 underline hover:text-blue-500"
					>Create one</a
				>
			</p>
			{#if form?.error}
				<p class="text-center font-bold text-red-500">Error: {form?.error}</p>
			{/if}
		</form>
	</div>
</main>

{#if visible}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed bottom-3 right-3 overflow-hidden rounded-md border border-orange-300 p-3 text-orange-600"
	>
		{#if postSignup}
			Successfully signed up. You can log in now.
		{/if}
		{#if unauthenticated}
			Please log in before visiting that page.
		{/if}
		{#if loggedOut}
			Successfully logged out.
		{/if}
		<div class="absolute bottom-0 left-0 h-1 bg-orange-300" style="width: {$progress}%"></div>
	</div>
{/if}
