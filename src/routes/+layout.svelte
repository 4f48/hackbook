<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<form method="POST" action="/search">
	<input placeholder="Search hackers..." name="search" required />
</form>
{@render children()}
