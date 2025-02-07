<script lang="ts">
	export let role: string;
	export let content: string;
</script>

<div class="message {role}">
	<strong>{role === 'user' ? 'You' : 'Tutor'}:</strong>
	{content}
</div>

<style>
	.message {
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 5px;
		line-height: 1.5;
	}
	.user {
		background-color: #e3f2fd;
		align-self: flex-end;
		margin-left: 20%;
	}
	.tutor {
		background-color: #f5f5f5;
		align-self: flex-start;
		margin-right: 20%;
	}
</style>
