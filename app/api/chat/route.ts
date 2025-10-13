import { NextRequest, NextResponse } from 'next/server';
import { DAVE_PROFILE } from '../../../data/dave';
import { CASE_STUDIES } from '../../../data/cases';

// --- Chunking helper ---
function chunkWorkHistory(workHistory: any[]): string[] {
  const chunks: string[] = [];
  
  workHistory.forEach(job => {
    const chunk = `${job.company} (${job.dates}): ${job.role}. ${job.description || ''}${job.achievements ? ' Achievements: ' + job.achievements.join('; ') : ''}`;
    // Split into ~400 char chunks if needed
    if (chunk.length <= 400) {
      chunks.push(chunk);
    } else {
      // Simple split by sentence
      const sentences = chunk.match(/[^.!?]+[.!?]+/g) || [chunk];
      let currentChunk = '';
      sentences.forEach(sentence => {
        if ((currentChunk + sentence).length <= 400) {
          currentChunk += sentence;
        } else {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        }
      });
      if (currentChunk) chunks.push(currentChunk.trim());
    }
  });
  
  return chunks;
}

function scoreChunk(chunk: string, queryKeywords: string[]): number {
  const chunkLower = chunk.toLowerCase();
  let score = 0;
  queryKeywords.forEach(keyword => {
    if (chunkLower.includes(keyword)) score += 1;
  });
  return score;
}

function topRelevantChunks(chunks: string[], question: string, limit: number = 2): string[] {
  const queryKeywords = extractKeywords(question);
  return chunks
    .map(chunk => ({ chunk, score: scoreChunk(chunk, queryKeywords) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}

// --- FAQ matching helper ---
function matchFAQ(question: string, faqs: any[]): any | null {
  const questionLower = question.toLowerCase().trim();
  
  // Exact or very close match
  for (const faq of faqs) {
    const faqLower = faq.q.toLowerCase();
    if (questionLower === faqLower || 
        questionLower.includes(faqLower) || 
        faqLower.includes(questionLower)) {
      return faq;
    }
  }
  
  // Keyword-based similarity
  const questionKeywords = extractKeywords(question);
  const matches = faqs.map(faq => {
    const faqKeywords = extractKeywords(faq.q);
    const commonKeywords = questionKeywords.filter(k => faqKeywords.includes(k));
    return { faq, score: commonKeywords.length };
  }).filter(m => m.score >= 2); // At least 2 keywords in common
  
  if (matches.length > 0) {
    matches.sort((a, b) => b.score - a.score);
    return matches[0].faq;
  }
  
  return null;
}

// --- Tiny retrieval helpers ---
function extractKeywords(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function scoreCase(caseStudy: any, queryKeywords: string[]): number {
  const caseKeywords = caseStudy.keywords.map((k: string) => k.toLowerCase());
  const caseText = [
    caseStudy.title,
    caseStudy.headline || '',
    caseStudy.challenge,
    ...caseStudy.approach,
    ...caseStudy.outcome,
    ...(caseStudy.bullets || [])
  ].join(' ').toLowerCase();
  
  let score = 0;
  
  // Direct keyword matches (high weight)
  queryKeywords.forEach(qk => {
    if (caseKeywords.includes(qk)) score += 3;
    if (caseText.includes(qk)) score += 1;
  });
  
  return score;
}

function topRelevantCases(question: string, limit: number = 2) {
  const queryKeywords = extractKeywords(question);
  
  // Check if question is about "projects" or "work"
  const isProjectQuery = /\b(project|projects|work|portfolio|case|cases|example|examples)\b/i.test(question);
  
  // Priority case studies for project queries
  const priorityCases = ['vicroads', 'eurostar', 'latrobe'];
  
  const scored = CASE_STUDIES.map(cs => ({
    case: cs,
    score: scoreCase(cs, queryKeywords)
  }))
  .map(item => {
    // Boost priority cases when asking about projects
    if (isProjectQuery && priorityCases.some(priority => 
      item.case.title.toLowerCase().includes(priority)
    )) {
      return { ...item, score: item.score + 10 }; // Add significant boost
    }
    return item;
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);
  
  return scored.map(item => item.case);
}

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

    // --- Extract question from last user message ---
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const question = lastUserMessage?.content || '';
    
    // --- Analytics: Initialize tracking ---
    const analytics = {
      question,
      timestamp: new Date().toISOString(),
      cases_selected: [] as string[],
      answered_from: 'profile' as 'profile' | 'case' | 'faq'
    };
    
    // --- Check for FAQ match first ---
    const faqMatch = matchFAQ(question, DAVE_PROFILE.faqs);
    
    // --- Get relevant case studies ---
    const relatedCases = topRelevantCases(question, 2);
    analytics.cases_selected = relatedCases.map(c => c.title);
    
    // --- Chunk work history and get top-2 relevant chunks ---
    const workHistoryChunks = chunkWorkHistory(DAVE_PROFILE.workHistory || []);
    const relevantWorkChunks = topRelevantChunks(workHistoryChunks, question, 2);
    
    // Determine answer source for analytics
    if (faqMatch) {
      analytics.answered_from = 'faq';
    } else if (relatedCases.length > 0) {
      analytics.answered_from = 'case';
    }
    
    // Analytics logging
    console.log('=== ANALYTICS ===');
    console.log('Question:', question);
    console.log('Cases selected:', analytics.cases_selected);
    console.log('Answered from:', analytics.answered_from);
    console.log('FAQ match:', faqMatch ? faqMatch.q : 'none');
    console.log('Work chunks:', relevantWorkChunks.length);
    console.log('================');

    // --- Build the seeded system prompt with profile, FAQ, cases, and work chunks ---
    let systemPrompt = `You are DAVE:5000, a helpful assistant representing designer David Black.

PERSONALITY & TONE:
- Friendly, professional, conversational
- Concise but informative
- Use natural language (not overly formal)
- Occasionally use subtle design/tech terminology when relevant
- Show enthusiasm for David's work without being salesy

RESPONSE GUIDELINES:
- Answer using ONLY the profile and case study data below
- Keep responses focused and scannable: one-line summary + up to 3 bullets
- Use **bold** for emphasis on key skills or achievements
- When listing items, use bullets (•) or hyphens (-)
- If the question is not covered in profile/case studies, say: "Not in my profile or case studies, but feel free to reach out at hello@david.black"
- When referencing portfolio work, link to: https://www.david.black/work
- When suggesting contact, link to: https://www.david.black/contact
- NEVER link to just https://www.david.black (the homepage) - always use specific pages
- If asked about availability, be clear and direct

${faqMatch ? `\n⚠️ FAQ MATCH DETECTED ⚠️\nThe user's question matches this FAQ. Use this answer VERBATIM:\nQ: ${faqMatch.q}\nA: ${faqMatch.a}\n\nFormat this as your opening summary and add a relevant link if applicable.\n` : ''}

Style: Start with a concise summary (no "TL;DR" label) + up to 3 bullets. Quote metrics verbatim. If unknown, say "Not in my profile/case studies." End with a next step (link or contact). Output format:
[Brief summary statement]
• …
• …
• …
Link: <url or '—'>

PROFILE DATA (core info):
Name: ${DAVE_PROFILE.name}
Title: ${DAVE_PROFILE.title}
Location: ${DAVE_PROFILE.location}
Summary: ${DAVE_PROFILE.summary}
Bio: ${DAVE_PROFILE.bio}
Skills: ${JSON.stringify(DAVE_PROFILE.skills)}
Availability: ${DAVE_PROFILE.availability}
Links: ${JSON.stringify(DAVE_PROFILE.links)}

RELEVANT WORK HISTORY (top 2 chunks for this question):
${relevantWorkChunks.length > 0 ? relevantWorkChunks.join('\n\n') : 'No specific work history chunks matched this question.'}

CASE STUDIES (top 2 for this question):
${JSON.stringify(relatedCases, null, 2)}

Remember: Be helpful, be human, be brief. If FAQ matched, use that answer verbatim.`;

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
        max_tokens: 1200, // Allow for structured TL;DR + bullets format
        temperature: 0.4, // Lower temperature for more consistent, factual responses
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
