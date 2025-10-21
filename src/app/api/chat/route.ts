import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables in Vercel.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);

    let errorMessage = 'Failed to process chat request';
    if (error?.status === 401) {
      errorMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.';
    } else if (error?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: error?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
