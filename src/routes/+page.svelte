<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	let { form }: { form: ActionData } = $props();

	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	const postSignup = $page.url.searchParams.has('post_signup');
	const unauthenticated = $page.url.searchParams.has('unauthenticated');
	const loggedOut = $page.url.searchParams.has('logged_out');

	let visible = $state(false);
	let progress = tweened(100);

	if (postSignup || unauthenticated || loggedOut) {
		onMount(() => {
			const params = new URLSearchParams($page.url.searchParams);
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

<h1>Hackbook</h1>
<p>Social media for hack clubbers and their projects</p>

<h2>Login</h2>
<form method="POST" use:enhance>
	<label for="email">Email</label>
	<input type="email" name="email" id="email" required maxlength="254" />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" required minlength="8" />

	<button type="submit">Log In</button>
	{#if !form?.success}
		<p class="text-red">{form?.error}</p>
	{/if}
</form>
<p>Don't have an account? <a href="/signup">Create one</a></p>

{#if visible}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed bottom-3 right-3 overflow-hidden border border-black p-3"
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
		<div class="absolute bottom-0 left-0 h-1 bg-black" style="width: {$progress}%"></div>
	</div>
{/if}
