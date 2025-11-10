
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: string;
  ingredients: Ingredient[];
  steps: string[];
  missingIngredients: string[];
}
