<script lang="ts">
	import ChatMessage from '$components/ChatMessage.svelte';
	import LanguageSelector from '$components/LanguageSelector.svelte';
	import TopicSelector from '$components/TopicSelector.svelte';
	import { LANGUAGES } from '$lib/constants/languages';
	import { TOPICS } from '$lib/constants/topics';

	let userInput: string = '';
	let conversation: { role: string; content: string }[] = [];
	let isLoading: boolean = false;
	let errorMessage: string | null = null;
	let selectedLanguageCode: string = LANGUAGES[0].code; // Store the selected language code
	let selectedLanguageName: string = LANGUAGES[0].name; // Store the selected language name
	let selectedTopic: string = TOPICS[0].id;

	async function sendMessage(): Promise<void> {
		if (!userInput.trim()) {
			errorMessage = 'Please enter a message.';
			return;
		}

		isLoading = true;
		errorMessage = null;

		try {
			const response = await fetch('/api/tutor', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: userInput,
					language: selectedLanguageName,
					topic: selectedTopic
				})
			});

			if (!response.ok) {
				throw new Error('Failed to fetch response from the tutor.');
			}

			const data = await response.json();
			console.log('API Response:', data); // Debugging: Log the response

			// Update conversation immutably
			conversation = [
				...conversation,
				{ role: 'user', content: userInput },
				{ role: 'tutor', content: data.reply }
			];
			console.log('Updated Conversation:', conversation); // Debugging: Log the conversation

			userInput = '';
		} catch (error) {
			errorMessage = 'An error occurred. Please try again.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<main>
	<h1>AI-Powered Language Tutor</h1>
	<div class="controls">
		<LanguageSelector
			bind:selectedLanguage={selectedLanguageCode}
			onLanguageChange={(name) => (selectedLanguageName = name)}
		/>
		<TopicSelector bind:selectedTopic onTopicChange={(id) => (selectedTopic = id)} />
	</div>
	<div class="chat">
		{#each conversation as msg}
			<!-- <ChatMessage role={msg.role} content={msg.content} /> -->

			<ChatMessage role={msg.role} content={msg.content} />
		{/each}
		{#if isLoading}
			<div class="message loading">Tutor is typing...</div>
		{/if}
	</div>
	{#if errorMessage}
		<div class="error">{errorMessage}</div>
	{/if}
	<div class="input-container">
		<input
			bind:value={userInput}
			placeholder="Ask me anything..."
			disabled={isLoading}
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button on:click={sendMessage} disabled={isLoading}>
			{isLoading ? 'Sending...' : 'Send'}
		</button>
	</div>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
		background-color: #f9f9f9;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h1 {
		text-align: center;
		color: #0070f3;
	}

	.chat {
		margin-bottom: 20px;
		max-height: 400px;
		overflow-y: auto;
		padding: 10px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

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

	.loading {
		color: #666;
		font-style: italic;
		text-align: center;
	}

	.error {
		color: #ff4d4d;
		text-align: center;
		margin-bottom: 10px;
	}

	.input-container {
		display: flex;
		gap: 10px;
	}

	input {
		flex: 1;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 16px;
	}

	button {
		padding: 10px 20px;
		background-color: #0070f3;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		main {
			padding: 10px;
		}

		h1 {
			font-size: 24px;
		}

		.chat {
			max-height: 300px;
		}

		input {
			font-size: 14px;
		}

		button {
			font-size: 14px;
		}
	}
</style>
