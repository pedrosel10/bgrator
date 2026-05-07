import { GoogleGenAI } from '@google/genai';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBo1Q8SXGAoBxNDQvJbbaQ0RglfC__mNVo" });
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: "A beautiful centered logo of a blue star, flat vector design",
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png"
      }
    });

    console.log("Success! Image generated with imagen-4.0-generate-001.");
  } catch (err) {
    console.error("Error with imagen-4:", err.message);
    
    // Fallback test
    try {
        const response2 = await ai.models.generateImages({
          model: "gemini-2.5-flash-image",
          prompt: "A beautiful centered logo of a blue star, flat vector design",
          config: { numberOfImages: 1 }
        });
        console.log("Success with gemini-2.5-flash-image");
    } catch(err2) {
        console.error("Error with gemini-2.5:", err2.message);
    }
  }
}

test();
