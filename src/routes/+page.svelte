<script>
	let userInput = '';
	/**
	 * @type {any[]}
	 */
	let conversation = [];
	let isLoading = false;

	async function sendMessage() {
		if (!userInput.trim() || isLoading) return;

		isLoading = true;
		try {
			const response = await fetch('/api/tutor', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userInput })
			});

			const data = await response.json();
			conversation.push({ role: 'user', content: userInput });
			conversation.push({ role: 'tutor', content: data.reply });
			userInput = '';
		} catch (error) {
			console.error('Error sending message:', error);
			conversation.push({
				role: 'tutor',
				content: 'Sorry, something went wrong. Please try again.'
			});
		} finally {
			isLoading = false;
		}
	}

	// Scroll to the bottom of the chat when a new message is added
	$: if (conversation.length) {
		setTimeout(() => {
			const chatWindow = document.querySelector('.chat');
			if (chatWindow) {
				chatWindow.scrollTop = chatWindow.scrollHeight;
			}
		}, 10);
	}
</script>

<main>
	<h1>AI-Powered French Tutor</h1>
	<div class="chat">
		{#each conversation as msg}
			<div class="message {msg.role}">
				<strong>{msg.role === 'user' ? 'You' : 'Tutor'}:</strong>
				{msg.content}
			</div>
		{/each}
		{#if isLoading}
			<div class="message tutor">
				<strong>Tutor:</strong> <span class="loading">Thinking...</span>
			</div>
		{/if}
	</div>
	<div class="input-container">
		<input
			bind:value={userInput}
			placeholder="Ask me anything in French..."
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
			disabled={isLoading}
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
		margin-bottom: 20px;
	}

	.chat {
		height: 400px;
		overflow-y: auto;
		margin-bottom: 20px;
		padding: 10px;
		background-color: white;
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
	}

	.message {
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 10px;
		line-height: 1.5;
	}

	.user {
		background-color: #e3f2fd;
		margin-left: 20%;
		margin-right: 0;
	}

	.tutor {
		background-color: #f5f5f5;
		margin-right: 20%;
		margin-left: 0;
	}

	.loading {
		color: #888;
		font-style: italic;
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
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #005bb5;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>
