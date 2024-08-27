import { measureType } from 'src/app.dtos';
import { GeminiInterface } from './geminiInterface';
import { GoogleAIFileManager } from '@google/generative-ai/server';

import 'dotenv/config';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

export class Gemini implements GeminiInterface {
  private basePrompt =
    'In this prompt you will extract the reading value of a meter from %s. You must analyze the image and return only the measurement number, if there is none return 0. If there is more than one meter available within the image, choose one and return its measurement number. The measurement number must be an integer value.'; // prompt used to gemini, if gemini not found a meter return a 0
  private fileManager: GoogleAIFileManager; // file manager to send the photo for Google
  private model: GenerativeModel; // generative model to get the measure value
  constructor() {
    const apiKey = process.env['GEMINI_API_KEY']; // get the api key
    this.fileManager = new GoogleAIFileManager(apiKey);
    const genAi = new GoogleGenerativeAI(apiKey);
    this.model = genAi.getGenerativeModel({
      model: 'gemini-1.5-flash', // model
    });
  }
  async getMeasureValue(
    imagePath: string,
    measureType: measureType,
  ): Promise<{ measureValue: number }> {
    const uploadResponse = await this.fileManager.uploadFile(imagePath, {
      mimeType: 'image/webp',
    }); // upload image for the server
    const imageUri = uploadResponse.file.uri; // get the uri
    const mimeType = uploadResponse.file.mimeType; // get the mimeType
    const prompt = this.basePrompt.replace('%s', measureType); // prompt to send for gemini
    const result = await this.model.generateContent([
      { fileData: { mimeType: mimeType, fileUri: imageUri } },
      { text: prompt },
    ]); // result of generation
    const measureValue = Number(result.response.text()); // convert the measure value to number
    return {
      measureValue: measureValue,
    };
  }
}
