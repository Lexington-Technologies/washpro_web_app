import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const streamChat = async (req, res) => {
  const { message, history } = req.body;

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...history,
        { role: 'user', content: message }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      res.write(content);
    }

    res.end();
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    res.status(500).json({ error: 'Streaming failed' });
  }
}; 