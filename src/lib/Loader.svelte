<script lang="ts">
	import { navigating } from '$app/state';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let progress = $state(
		new Tween(0, {
			duration: 3500,
			easing: cubicOut
		})
	);
	$effect(() => {
		if (navigating.to) {
			progress.target = 75;
			navigating.complete?.then(() => {
				progress.set(100, { duration: 400 });
				setTimeout(() => {
					progress.set(0, { duration: 0 });
				}, 400);
			});
		}
	});
</script>

<div class="fixed z-10 h-1 bg-orange-500" style="width: {progress.current}%"></div>
