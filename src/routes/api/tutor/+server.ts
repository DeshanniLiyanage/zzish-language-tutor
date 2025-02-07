import { callLLM } from '$lib/api/tutor';
import { json, type RequestHandler } from '@sveltejs/kit';

interface Message {
	message: string;
	language: string;
	topic: string;
}

interface LLMResponse {
	reply: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const { message, language, topic }: Message = await request.json();

	if (!message?.trim()) {
		return json({ error: 'Message is required.' }, { status: 400 });
	}

	try {
		console.log(message + ' language : ' + language);
		const reply = await callLLM(message, language, topic);
		return json({ reply } as LLMResponse);
	} catch (error) {
		console.error('Error calling LLM:', error);
		return json({ error: 'Failed to get a response from the tutor.' }, { status: 500 });
	}
};
