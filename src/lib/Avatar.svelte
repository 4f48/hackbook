<script lang="ts">
	interface Props {
		avatar?: string;
		id: string;
		name: string;
	}

	const { avatar, id, name }: Props = $props();

	const nameComponents = name.split(' ', 2);
	const initials =
		nameComponents.length == 1
			? nameComponents[0][0]
			: nameComponents[0][0].toUpperCase() + nameComponents[1][0].toUpperCase();
</script>

<a href="/user/{id}" class="no-underline duration-200 hover:brightness-110">
	{#if avatar}
		<img class="h-10 w-10 rounded-full" src={avatar} alt="{name}'s avatar" />
	{:else}
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-300">
			<span class="font-bold text-orange-50">{initials}</span>
		</div>
	{/if}
</a>
