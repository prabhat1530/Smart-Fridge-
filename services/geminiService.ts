
import { GoogleGenAI, Type } from '@google/genai';
import { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: 'The name of the recipe.',
      },
      difficulty: {
        type: Type.STRING,
        enum: ['Easy', 'Medium', 'Hard'],
        description: 'The difficulty level of the recipe.',
      },
      prepTime: {
        type: Type.STRING,
        description: "Estimated preparation and cook time, e.g., '45 minutes'.",
      },
      calories: {
        type: Type.STRING,
        description: "Approximate calorie count per serving, e.g., '550 kcal'.",
      },
      ingredients: {
        type: Type.ARRAY,
        description: 'All ingredients required for the recipe.',
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
          },
          required: ['name', 'quantity'],
        },
      },
      steps: {
        type: Type.ARRAY,
        description: 'The step-by-step cooking instructions.',
        items: {
          type: Type.STRING,
        },
      },
      missingIngredients: {
        type: Type.ARRAY,
        description: "A list of ingredients required for the recipe that are likely not present in the user's photo.",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ['recipeName', 'difficulty', 'prepTime', 'calories', 'ingredients', 'steps', 'missingIngredients'],
  },
};

function dataUrlToBlob(dataUrl: string): { mimeType: string, data: string } {
    const parts = dataUrl.split(',');
    const meta = parts[0];
    const data = parts[1];
    const mimeType = meta.split(':')[1].split(';')[0];
    return { mimeType, data };
}

export const analyzeImageAndSuggestRecipes = async (imageDataUrl: string, dietaryFilters: string[]): Promise<Recipe[]> => {
  const { mimeType, data } = dataUrlToBlob(imageDataUrl);

  const imagePart = {
    inlineData: {
      mimeType,
      data,
    },
  };

  const filterText = dietaryFilters.length > 0
    ? `All suggested recipes must be suitable for the following dietary restrictions: ${dietaryFilters.join(', ')}.`
    : "There are no specific dietary restrictions.";

  const prompt = `
    Analyze the ingredients in this image. Based on what you see, suggest 3 to 5 diverse recipes.
    ${filterText}
    For each recipe, provide a detailed breakdown. Identify any key ingredients required for the recipe that are not visible in the image and list them under 'missingIngredients'.
    Return the response as a JSON array of objects that strictly adheres to the provided schema. Do not include any explanatory text or markdown formatting outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
          parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      },
    });

    const jsonString = response.text;
    const recipes = JSON.parse(jsonString);
    
    // Basic validation to ensure we have an array of recipes
    if (!Array.isArray(recipes)) {
        console.error("Gemini response is not an array:", recipes);
        return [];
    }
    return recipes as Recipe[];

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to fetch recipes from Gemini API.');
  }
};
