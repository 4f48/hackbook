<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
</script>

<div class="flex w-full justify-center">
	<main class="mt-12 w-[50%] rounded-2xl border border-orange-300 p-8">
		<h1 class="mb-3 text-3xl font-semibold text-orange-500">Settings</h1>

		<h2 class="mb-3 w-full border-b border-black text-lg font-semibold">Personal details</h2>
		<div class="flex flex-col gap-2">
			<form method="POST" use:enhance action="?/avatar" class="flex items-center gap-2">
				<h3 class="flex-grow">Change avatar</h3>
				<span class="w-[50%]">
					<Input
						maxlength="200"
						name="avatar"
						placeholder="Image link..."
						title="Upload empty to remove avatar."
					/>
				</span>
				<span class="w-[20%]">
					<Button type="submit">Upload</Button>
				</span>
			</form>
			<form method="POST" use:enhance action="?/name" class="flex items-center gap-2">
				<h3 class="flex-grow">Change name</h3>
				<span class="w-[50%]">
					<Input maxlength="16" minlength="3" name="name" placeholder="New name..." required />
				</span>
				<span class="w-[20%]">
					<Button type="submit">Change</Button>
				</span>
			</form>
			<form method="POST" use:enhance action="?/email" class="flex items-center gap-2">
				<h3 class="flex-grow">Change email address</h3>
				<span class="w-[50%]">
					<Input
						maxlength="254"
						name="email"
						placeholder="New email address..."
						type="email"
						required
					/>
				</span>
				<span class="w-[20%]">
					<Button type="submit">Change</Button>
				</span>
			</form>
			<form method="POST" use:enhance action="?/password" class="flex items-center gap-2">
				<h3 class="flex-grow">Change password</h3>
				<span class="w-[50%]">
					<Input
						minlength="8"
						name="password"
						placeholder="New password..."
						type="password"
						required
					/>
				</span>
				<span class="w-[20%]">
					<Button type="submit">Change</Button>
				</span>
			</form>
		</div>
		<h2 class="mb-3 mt-5 w-full border-b border-black text-lg font-semibold">Danger zone</h2>
		<div class="flex flex-col gap-3">
			<form method="POST" use:enhance action="?/logout">
				<button
					class="w-full transform rounded-md border border-orange-500 bg-orange-100 p-[0.4rem] text-sm text-orange-500 drop-shadow-sm transition-transform duration-150 hover:border-orange-400 hover:bg-orange-50 active:scale-90 disabled:cursor-not-allowed disabled:border-orange-300 disabled:bg-orange-300 disabled:hover:border-orange-300 disabled:active:scale-100"
					type="submit">Log out</button
				>
			</form>
			<form method="POST" use:enhance action="?/delete">
				<button
					class="w-full transform rounded-md border border-red-500 bg-red-500 p-[0.4rem] text-sm text-white drop-shadow-sm transition-transform duration-150 hover:border-red-600 hover:bg-red-600 active:scale-90 disabled:cursor-not-allowed disabled:border-orange-300 disabled:bg-orange-300 disabled:hover:border-orange-300 disabled:active:scale-100"
					type="submit">Delete account</button
				>
			</form>
		</div>
	</main>
</div>
