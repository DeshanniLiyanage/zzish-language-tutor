<script lang="ts">
	export let message: string;
</script>

{#if message}
	<div class="error">{message}</div>
{/if}

<style>
	.error {
		color: #ff4d4d;
		text-align: center;
		margin-bottom: 10px;
	}
</style>
