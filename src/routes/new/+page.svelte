<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	const { form }: { form: ActionData } = $props();
</script>

<h1>Post something</h1>
<form method="POST" use:enhance>
	<label for="content">Content</label>
	<textarea id="content" name="content" required maxlength="1500"></textarea>

	<label for="picture">Picture link (optional)</label>
	<input id="picture" name="picture" maxlength="200" />

	<button type="submit">Post</button>
	{#if form?.error}
		<p class="text-red">{form?.error}</p>
	{/if}
</form>
