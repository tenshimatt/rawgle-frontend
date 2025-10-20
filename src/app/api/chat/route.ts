import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // System prompt for raw pet nutrition assistant
    const systemPrompt = `You are an expert AI pet nutrition assistant specializing in raw feeding (BARF diet) for dogs and cats.

Your expertise includes:
- Raw feeding principles and benefits
- Portion calculations based on pet weight, age, and activity level
- Food safety and handling practices
- Meal planning and variety
- Transitioning from kibble to raw
- Common concerns and troubleshooting
- Nutritional requirements for different life stages

Guidelines:
- Provide evidence-based, practical advice
- Always emphasize food safety
- Recommend consulting a veterinarian for medical concerns
- Be friendly, helpful, and encouraging
- Use clear, simple language
- Include specific examples when helpful
- If unsure, acknowledge limitations and recommend professional consultation

Keep responses concise but informative, typically 2-4 paragraphs unless more detail is specifically requested.`;

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
