<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	let { form }: { form: ActionData } = $props();
</script>

<main class="flex h-[90vh] w-full items-center justify-center">
	<form
		method="POST"
		use:enhance
		class="mx-5 flex w-full flex-col gap-1 rounded-xl bg-orange-200 p-7 sm:mx-0 sm:w-[50vw] md:w-[28vw]"
	>
		<h1 class="mb-3 text-xl font-bold text-orange-500">Create your account</h1>
		<label for="name" class="text-orange-500">Name</label>
		<Input id="name" name="name" required minlength="3" maxlength="16" />

		<label for="email" class="text-orange-500">Email address</label>
		<Input id="email" name="email" type="email" required maxlength="254" />

		<label for="name" class="text-orange-500">Password</label>
		<Input id="password" name="password" type="password" required minlength="8" />

		<Button type="submit">Sign in</Button>
		<p class="text-center text-sm text-orange-400">
			Already have an account? <a href="/" class="text-blue-400 underline hover:text-blue-500"
				>Sign in</a
			>
		</p>
		{#if form?.error}
			<p class="text-center font-bold text-red-500">Error: {form?.error}</p>
		{/if}
	</form>
</main>
