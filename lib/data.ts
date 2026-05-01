import type { Product, UserProfile, MealEntry, WeightEntry, Exercise } from './types'

export const defaultProducts: Product[] = [
  // Nabiał
  { id: '1', name: 'Jajko kurze', calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: 'g', serving: 100, category: 'Nabiał' },
  { id: '2', name: 'Mleko 2%', calories: 50, protein: 3.4, carbs: 4.8, fat: 2, unit: 'ml', serving: 100, category: 'Nabiał' },
  { id: '3', name: 'Jogurt naturalny', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, unit: 'g', serving: 100, category: 'Nabiał' },
  { id: '4', name: 'Ser biały twarogowy', calories: 98, protein: 18, carbs: 3, fat: 2, unit: 'g', serving: 100, category: 'Nabiał' },
  { id: '5', name: 'Ser żółty gouda', calories: 356, protein: 25, carbs: 2, fat: 27, unit: 'g', serving: 100, category: 'Nabiał' },
  
  // Mięso
  { id: '6', name: 'Pierś z kurczaka', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g', serving: 100, category: 'Mięso' },
  { id: '7', name: 'Wołowina mielona', calories: 250, protein: 26, carbs: 0, fat: 15, unit: 'g', serving: 100, category: 'Mięso' },
  { id: '8', name: 'Wieprzowina schab', calories: 242, protein: 27, carbs: 0, fat: 14, unit: 'g', serving: 100, category: 'Mięso' },
  { id: '9', name: 'Łosoś', calories: 208, protein: 20, carbs: 0, fat: 13, unit: 'g', serving: 100, category: 'Ryby' },
  { id: '10', name: 'Tuńczyk w puszce', calories: 116, protein: 26, carbs: 0, fat: 1, unit: 'g', serving: 100, category: 'Ryby' },
  
  // Węglowodany
  { id: '11', name: 'Ryż biały', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: 'g', serving: 100, category: 'Węglowodany' },
  { id: '12', name: 'Makaron', calories: 131, protein: 5, carbs: 25, fat: 1.1, unit: 'g', serving: 100, category: 'Węglowodany' },
  { id: '13', name: 'Chleb pszenny', calories: 265, protein: 9, carbs: 49, fat: 3.2, unit: 'g', serving: 100, category: 'Węglowodany' },
  { id: '14', name: 'Płatki owsiane', calories: 389, protein: 17, carbs: 66, fat: 7, unit: 'g', serving: 100, category: 'Węglowodany' },
  { id: '15', name: 'Ziemniaki', calories: 77, protein: 2, carbs: 17, fat: 0.1, unit: 'g', serving: 100, category: 'Węglowodany' },
  
  // Warzywa
  { id: '16', name: 'Pomidor', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: 'g', serving: 100, category: 'Warzywa' },
  { id: '17', name: 'Ogórek', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, unit: 'g', serving: 100, category: 'Warzywa' },
  { id: '18', name: 'Sałata', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, unit: 'g', serving: 100, category: 'Warzywa' },
  { id: '19', name: 'Brokuły', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: 'g', serving: 100, category: 'Warzywa' },
  { id: '20', name: 'Marchewka', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, unit: 'g', serving: 100, category: 'Warzywa' },
  
  // Owoce
  { id: '21', name: 'Jabłko', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, unit: 'g', serving: 100, category: 'Owoce' },
  { id: '22', name: 'Banan', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: 'g', serving: 100, category: 'Owoce' },
  { id: '23', name: 'Pomarańcza', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, unit: 'g', serving: 100, category: 'Owoce' },
  { id: '24', name: 'Truskawki', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, unit: 'g', serving: 100, category: 'Owoce' },
  { id: '25', name: 'Awokado', calories: 160, protein: 2, carbs: 9, fat: 15, unit: 'g', serving: 100, category: 'Owoce' },
  
  // Orzechy i nasiona
  { id: '26', name: 'Orzechy włoskie', calories: 654, protein: 15, carbs: 14, fat: 65, unit: 'g', serving: 100, category: 'Orzechy' },
  { id: '27', name: 'Migdały', calories: 579, protein: 21, carbs: 22, fat: 50, unit: 'g', serving: 100, category: 'Orzechy' },
  { id: '28', name: 'Masło orzechowe', calories: 588, protein: 25, carbs: 20, fat: 50, unit: 'g', serving: 100, category: 'Orzechy' },
  
  // Napoje
  { id: '29', name: 'Kawa czarna', calories: 2, protein: 0.3, carbs: 0, fat: 0, unit: 'ml', serving: 100, category: 'Napoje' },
  { id: '30', name: 'Sok pomarańczowy', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, unit: 'ml', serving: 100, category: 'Napoje' },
]

export const defaultProfile: UserProfile = {
  name: 'Użytkownik',
  age: 30,
  weight: 75,
  targetWeight: 70,
  height: 175,
  activityLevel: 'moderate',
  goal: 'lose',
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
}

// Przykładowe dane początkowe
export const sampleMealEntries: MealEntry[] = [
  {
    id: '1',
    productId: '1',
    product: defaultProducts[0],
    quantity: 2,
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    productId: '14',
    product: defaultProducts[13],
    quantity: 50,
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '3',
    productId: '6',
    product: defaultProducts[5],
    quantity: 150,
    mealType: 'lunch',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: '4',
    productId: '11',
    product: defaultProducts[10],
    quantity: 100,
    mealType: 'lunch',
    date: new Date().toISOString().split('T')[0],
  },
]

export const sampleWeightEntries: WeightEntry[] = [
  { id: '1', date: '2024-01-01', weight: 78 },
  { id: '2', date: '2024-01-08', weight: 77.5 },
  { id: '3', date: '2024-01-15', weight: 77 },
  { id: '4', date: '2024-01-22', weight: 76.5 },
  { id: '5', date: '2024-01-29', weight: 76 },
  { id: '6', date: '2024-02-05', weight: 75.5 },
  { id: '7', date: '2024-02-12', weight: 75 },
]

export const sampleExercises: Exercise[] = [
  { id: '1', name: 'Bieganie', caloriesBurned: 350, duration: 30, date: new Date().toISOString().split('T')[0] },
]

export const exerciseTypes = [
  { name: 'Bieganie', caloriesPerMinute: 12 },
  { name: 'Spacer', caloriesPerMinute: 4 },
  { name: 'Rower', caloriesPerMinute: 8 },
  { name: 'Pływanie', caloriesPerMinute: 10 },
  { name: 'Siłownia', caloriesPerMinute: 6 },
  { name: 'Joga', caloriesPerMinute: 3 },
  { name: 'HIIT', caloriesPerMinute: 14 },
  { name: 'Tenis', caloriesPerMinute: 9 },
  { name: 'Piłka nożna', caloriesPerMinute: 10 },
]
