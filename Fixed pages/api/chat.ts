import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are DeFAI, an AI assistant specialized in DeFi portfolio optimization, particularly for Kaia-native USDT staking. Provide helpful, accurate advice about cryptocurrency and DeFi strategies.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'gpt-4',
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to process your message' });
  }
}
