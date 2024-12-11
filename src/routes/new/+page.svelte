<script lang="ts">
	import type { ActionData } from './$types';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import { enhance } from '$app/forms';

	const { form }: { form: ActionData } = $props();
</script>

<div class="flex h-[90vh] w-full items-center justify-center">
	<form
		method="POST"
		use:enhance
		class="mx-5 flex w-full flex-col gap-1 rounded-xl bg-orange-200 p-7 sm:mx-0 sm:w-[50vw] md:w-[28vw]"
	>
		<h1 class="mb-3 text-xl font-bold text-orange-500">What's hackin'?</h1>
		<label for="content">Content*</label>
		<textarea
			id="content"
			name="content"
			class="mb-3 h-[15vh] w-full resize-none rounded-md border-orange-300 bg-orange-100 p-[0.4rem] text-sm drop-shadow-sm placeholder:text-orange-300 hover:border-orange-400 focus:border-orange-400 focus:ring-0"
			required
			maxlength="1500"
		></textarea>

		<label for="picture">Picture link</label>
		<Input id="picture" name="picture" maxlength="2048" />
		<br class="mb-1" />
		<Button type="submit">Post!</Button>
		{#if form?.error}
			<p class="text-center font-bold text-red-500">Error: {form?.error}</p>
		{/if}
	</form>
</div>
