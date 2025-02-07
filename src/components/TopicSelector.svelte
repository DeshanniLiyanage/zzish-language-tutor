<script lang="ts">
	import { TOPICS } from '$lib/constants/topics';
	export let selectedTopic: string;
	export let onTopicChange: (id: string) => void;
</script>

<select bind:value={selectedTopic} on:change={() => onTopicChange(selectedTopic)}>
	{#each TOPICS as topic}
		<option value={topic.id}>{topic.name}</option>
	{/each}
</select>
