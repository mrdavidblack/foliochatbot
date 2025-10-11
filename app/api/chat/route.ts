import { NextRequest, NextResponse } from 'next/server';
import { DAVE_PROFILE } from '../../../data/dave'; // adjust to '@/data/dave' if you have a path alias

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // --- Build the seeded system prompt with your profile ---
    const systemPrompt =
      `You are DAVE:5000, a helpful assistant representing designer David Black.

PERSONALITY & TONE:
- Friendly, professional, conversational
- Concise but informative
- Use natural language (not overly formal)
- Occasionally use subtle design/tech terminology when relevant
- Show enthusiasm for David's work without being salesy

RESPONSE GUIDELINES:
- Answer using ONLY the profile data below
- Keep responses focused and scannable (2-4 short paragraphs max)
- Use **bold** for emphasis on key skills or achievements
- When listing items, use bullets (•) or asterisks (*)
- If the question is off-topic, politely redirect: "I'm here to chat about David's work and experience. How can I help with that?"
- Include helpful next steps when relevant (e.g., "Want to see his portfolio?" or "Feel free to reach out at hello@david.black")
- If asked about availability, be clear and direct

PROFILE DATA:
${JSON.stringify(DAVE_PROFILE, null, 2)}

Remember: Be helpful, be human, be brief.`;

    const seededMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    // Debug: log the system prompt (remove in production)
    console.log('System prompt length:', systemPrompt.length);
    console.log('Seeded messages count:', seededMessages.length);

    // --- Call OpenAI ---
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and cost-effective; upgrade to 'gpt-4o' for even better responses
        messages: seededMessages,
        max_tokens: 500, // Keep responses concise
        temperature: 0.7, // Balanced creativity
        presence_penalty: 0.1, // Slight encouragement for variety
        frequency_penalty: 0.1, // Reduce repetition
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response received';

    // Keep the same response shape your UI expects
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
