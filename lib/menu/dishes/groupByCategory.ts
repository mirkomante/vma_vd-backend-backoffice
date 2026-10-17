import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import { pluralizeIt } from '@/lib/menu/display/pluralizeIt'

export type DishListRow = {
  id: number | string
  name: string
  price: number
  disabled?: boolean | null
  soldOut?: boolean | null
  categoryId: number | string
  categoryName: string
}

export type DishCategoryGroup = {
  categoryId: number | string
  categoryName: string
  heading: string
  dishes: DishListRow[]
}

export function formatCategoryGroupHeading(categoryName: string, dishCount: number): string {
  return `${categoryName} ${pluralizeIt(dishCount, 'piatto', 'piatti')}`
}

export function groupDishesByCategory(dishes: DishListRow[]): DishCategoryGroup[] {
  const byCategory = new Map<string, DishCategoryGroup>()

  for (const dish of dishes) {
    const key = String(dish.categoryId)
    let group = byCategory.get(key)
    if (!group) {
      group = {
        categoryId: dish.categoryId,
        categoryName: dish.categoryName,
        heading: '',
        dishes: [],
      }
      byCategory.set(key, group)
    }
    group.dishes.push(dish)
  }

  const groups = [...byCategory.values()]
  for (const group of groups) {
    group.dishes.sort((a, b) => compareItalianNames(a.name, b.name))
    group.heading = formatCategoryGroupHeading(group.categoryName, group.dishes.length)
  }

  groups.sort((a, b) => compareItalianNames(a.categoryName, b.categoryName))
  return groups
}
