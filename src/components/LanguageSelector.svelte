<script lang="ts">
	import { LANGUAGES } from '$lib/constants/languages';
	export let selectedLanguage: string;
	export let onLanguageChange: (name: string) => void;
</script>

<select
	bind:value={selectedLanguage}
	on:change={() => {
		const selected = LANGUAGES.find((lang) => lang.code === selectedLanguage);
		if (selected) onLanguageChange(selected.name);
	}}
>
	{#each LANGUAGES as language}
		<option value={language.code}>{language.name}</option>
	{/each}
</select>
