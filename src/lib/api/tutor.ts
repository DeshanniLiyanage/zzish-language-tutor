export async function callLLM(
	message: string,
	language: string,
	topic: string,
	retries = 3
): Promise<string> {
	const prompt = `You are an expert ${language} language teacher and I am a student. Teach me ${language} focusing on the topic of ${topic}. Keep your responses concise, engaging, and relevant to the topic. If I make a mistake, gently correct me and provide examples. The student says: "${message}".`;
	const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY; // Use environment variable
	const model = 'EleutherAI/gpt-neo-2.7B'; // Try switching to 'gpt2' if this fails
	const url = `https://api-inference.huggingface.co/models/${model}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			inputs: prompt // Hugging Face uses `inputs` instead of `messages`
		})
	});

	const data = await response.json();

	// Log the full response for debugging
	console.log('API Response:', JSON.stringify(data, null, 2));

	if (!response.ok) {
		if (response.status === 503 && retries > 0) {
			// Model is loading, retry after a delay
			console.log('Model is loading, retrying...');
			await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
			return callLLM(message, language, topic, retries - 1); // Retry
		}
		throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(data)}`);
	}

	// Hugging Face returns an array of responses
	if (Array.isArray(data) && data.length > 0) {
		return data[0].generated_text; // Correctly access the generated text
	} else {
		throw new Error('Invalid response format from Hugging Face API');
	}
}
