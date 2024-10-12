import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const modifiedPrompt = "A TOK emoji of " + prompt;

    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: modifiedPrompt,
          apply_watermark: false,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0 && output[0] instanceof ReadableStream) {
      const stream = output[0];
      const chunks = [];
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks);
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;

      return res.status(200).json({ emojiUrl: dataUrl });
    } else {
      console.error('Unexpected output format from Replicate API:', output);
      return res.status(500).json({ message: 'Unexpected output format from Replicate API' });
    }
  } catch (error) {
    console.error('Error generating emoji:', error.message);
    return res.status(500).json({ message: 'Error generating emoji' });
  }
}
