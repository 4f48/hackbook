<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	let { form }: { form: ActionData } = $props();
</script>

<h2>Sign Up</h2>
<form method="POST" use:enhance>
	<label for="name">Username</label>
	<input type="text" name="name" id="name" required minlength="3" maxlength="16" />

	<label for="email">Email</label>
	<input type="email" name="email" id="email" required maxlength="254" />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" required minlength="8" />

	<button type="submit">Sign Up</button>
	{#if !form?.success}
		<p class="text-red">{form?.error}</p>
	{/if}
</form>
<p>Already have an account? <a href="/">Log In</a></p>
