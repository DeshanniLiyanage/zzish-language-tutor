import { json, type RequestHandler } from '@sveltejs/kit';

interface Message {
	message: string;
}

interface LLMResponse {
	reply: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message }: Message = await request.json();

		if (!message) {
			throw new Error('Message is required');
		}

		const reply = await callLLM(message);

		return json({ reply } as LLMResponse);
	} catch (error) {
		console.error('Error in POST handler:', error);
		return json({ reply: 'An error occurred while processing your request.' }, { status: 500 });
	}
};

async function callLLM(message: string, retries = 3): Promise<string> {
	const prompt = `You are an expert French language teacher and I am a student. Teach me French. The student says: "${message}". Respond in a helpful and engaging way.`;
	const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY; // Use environment variable
	const model = 'EleutherAI/gpt-neo-2.7B'; // Try switching to 'gpt2' if this fails EleutherAI/gpt-neo-2.7B
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
			return callLLM(message, retries - 1); // Retry
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
