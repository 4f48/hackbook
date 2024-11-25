<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
</script>

<h1>Hello, {data.user?.name}</h1>
<a href="/feed">go to your feed</a>
<p>{data.user?.email}</p>
<form method="POST" use:enhance>
	<button type="submit">Log Out</button>
</form>
