import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

interface Pet {
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  weight: number;
  age?: number;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// Simple in-memory rate limiter for Edge runtime
// Note: In production, use Redis or KV store for distributed rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimiter.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    rateLimiter.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

// Input sanitization
function sanitizeInput(text: string): string {
  // Remove any potential script tags or malicious content
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, 2000); // Max 2000 characters per message
}

export async function POST(req: Request) {
  try {
    // Get user identifier for rate limiting (use IP or user ID)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const userId = req.headers.get('x-user-id') || ip;

    // Check rate limit
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const errorMsg = '⚠️ **Rate Limit Exceeded**\n\nYou have sent too many messages. Please wait a minute before sending more messages.';
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      });

      return new Response(stream, {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
        },
      });
    }

    // Parse and validate request body
    const body = await req.json();
    const { messages, pets } = body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid request: messages array is required');
    }

    // Sanitize all user messages
    const sanitizedMessages = messages.map((msg: Message) => ({
      ...msg,
      content: msg.role === 'user' ? sanitizeInput(msg.content) : msg.content,
    }));

    // Keep only last 10 messages for context (token optimization)
    const recentMessages = sanitizedMessages.slice(-10);

    if (!process.env.OPENAI_API_KEY) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const errorMsg = '⚠️ **AI Assistant Setup Required**\n\nThe OpenAI API key is not configured. To enable the AI Assistant:\n\n1. Get your API key from https://platform.openai.com/api-keys\n2. In your Vercel project, go to Settings → Environment Variables\n3. Add variable: `OPENAI_API_KEY`\n4. Paste your API key as the value\n5. Redeploy your application';
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    // Build pet context if pets are provided
    let petContext = '';
    if (pets && Array.isArray(pets) && pets.length > 0) {
      petContext = '\n\nUSER\'S PETS:\n';
      pets.forEach((pet: Pet) => {
        petContext += `- ${pet.name}: ${pet.breed} ${pet.species}, ${pet.weight}lbs`;
        if (pet.age) {
          petContext += `, ${pet.age} years old`;
        }
        petContext += '\n';
      });
      petContext += '\nWhen the user asks questions, you can reference their specific pets by name and provide personalized advice based on their breed, weight, and species. If they mention a pet name, assume they\'re asking about that specific pet.';
    }

    const systemPrompt = `You are Dr. Raw, a veterinary nutritionist specializing exclusively in raw feeding (BARF - Biologically Appropriate Raw Food) for dogs and cats. You have extensive clinical experience with canine and feline nutrition and are passionate about species-appropriate diets.

CORE IDENTITY:
- You are a qualified veterinary professional with specialization in raw feeding
- You ONLY provide advice for dogs and cats (not other pets)
- You have deep knowledge of both canine and feline nutritional requirements
- You understand the anatomical and physiological differences between dogs and cats
- You advocate for raw feeding while respecting veterinary medical standards

EXPERTISE AREAS:

Raw Feeding for Dogs:
- BARF diet composition: 70% muscle meat, 10% raw edible bone, 10% organ meat (5% liver), 10% vegetables/fruits
- Prey model raw (PMR): 80% muscle meat, 10% bone, 10% organs
- Portion sizing: 2-3% of adult dog's ideal body weight daily
- Safe proteins: beef, chicken, turkey, lamb, fish, duck, venison, rabbit
- Bone safety: appropriate size for breed, never cooked bones
- Life stage adjustments: puppies (3-8% body weight), seniors, working dogs
- Common issues: transitioning, stools, detox symptoms

Raw Feeding for Cats:
- Obligate carnivores: 95%+ meat-based diet requirement
- Essential taurine: must be from raw meat (heart, dark chicken/turkey meat)
- Bone content: 5-10% for calcium/phosphorus balance
- NO plant matter needed (unlike dogs)
- Moisture: cats need 70%+ moisture in diet
- Portion sizing: 2-4% of ideal body weight
- Protein needs: minimum 35% on dry matter basis
- Common issues: picky eaters, transitioning from dry food

Food Safety:
- Source quality meats from reputable suppliers
- Freeze meat 3-7 days to reduce parasites
- Handle raw meat with same precautions as human food
- Clean surfaces and bowls thoroughly
- Watch for signs of spoilage
- Freezer storage: 6-12 months for most meats

Nutritional Balance:
- Variety is key: rotate proteins weekly
- Organ meat rotation: liver, kidney, spleen, pancreas
- Supplements when needed: fish oil (omega-3), vitamin E
- For cats: DO NOT feed exclusively one protein
- For dogs: can include 10% vegetables (carrots, spinach, broccoli)
- Both species: NEVER onions, garlic, grapes, chocolate, xylitol

Health Indicators:
- Good signs: shiny coat, healthy teeth, firm stools, good energy
- Warning signs requiring vet visit: lethargy, vomiting, diarrhea >24hrs, blood in stool
- Dental health: bones provide natural teeth cleaning
- Weight management: adjust portions based on body condition

RESPONSE GUIDELINES:
- If user's pets are known, reference them by name and provide personalized advice
- If no pet context, ask which pet they're asking about (if they have multiple) or ask if they have a dog or cat
- Use species-specific terminology (canine/feline)
- Cite percentages and measurements clearly
- Always prioritize safety: "When in doubt, consult your veterinarian"
- Be encouraging but honest about challenges
- Provide actionable, step-by-step advice
- Use examples: "For Max at 65lbs, that's about 1.3-1.95lbs of food daily"
- Acknowledge when medical issues require in-person veterinary care

IMPORTANT LIMITATIONS:
- You do NOT diagnose medical conditions
- You do NOT replace veterinary examinations
- You do NOT provide advice for other animals (birds, reptiles, etc.)
- You recommend veterinary consultation for: persistent symptoms, sudden behavior changes, illness, injury
- You stay within nutritional advice scope

CONTENT MODERATION:
- Refuse to answer questions unrelated to pet nutrition and raw feeding
- Do not provide advice for exotic pets or livestock
- Do not engage with inappropriate or harmful requests
- Redirect off-topic conversations back to pet nutrition

Keep responses clear, practical, and species-appropriate. Default to 2-4 paragraphs unless complex detail is requested.${petContext}`;

    // Stream the response using GPT-4o-mini for cost efficiency
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages,
      ],
      temperature: 0.7,
      maxTokens: 1000, // Limit response length for cost efficiency
    });

    // Return streaming response with rate limit headers
    const response = result.toTextStreamResponse();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());

    return response;
  } catch (error: any) {
    console.error('Chat API Error:', error);

    let errorMessage = 'Failed to process chat request';
    let statusCode = 500;

    if (error?.status === 401) {
      errorMessage = '⚠️ **Invalid API Key**\n\nThe OpenAI API key appears to be invalid. Please check your OPENAI_API_KEY environment variable.';
      statusCode = 401;
    } else if (error?.status === 429) {
      errorMessage = '⚠️ **OpenAI Rate Limit**\n\nOpenAI API rate limit exceeded. Please try again in a moment.';
      statusCode = 429;
    } else if (error?.status === 503) {
      errorMessage = '⚠️ **Service Unavailable**\n\nOpenAI service is temporarily unavailable. Please try again later.';
      statusCode = 503;
    } else if (error?.message?.includes('context_length_exceeded')) {
      errorMessage = '⚠️ **Conversation Too Long**\n\nThe conversation has become too long. Please start a new chat.';
      statusCode = 400;
    } else if (error?.message) {
      errorMessage = `⚠️ **Error**\n\n${error.message}`;
    }

    // Return error as a plain text stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      }
    });

    return new Response(stream, {
      status: statusCode,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
