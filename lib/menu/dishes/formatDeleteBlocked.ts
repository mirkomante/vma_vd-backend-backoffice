import {
  PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
  PIATTI_FIXED_MENU_LIST_SEPARATOR,
} from './copy'

export function formatFixedMenusBlockedDeleteDescription(
  menuNames: string[],
): string {
  const count = menuNames.length
  if (count === 0) {
    return ''
  }
  const head = menuNames.slice(0, 3)
  const listed = head.join(PIATTI_FIXED_MENU_LIST_SEPARATOR)
  const noun = count === 1 ? '1 menù fisso' : `${count} menù fissi`
  if (count <= 3) {
    return `È usato in ${noun}: ${listed}. Toglilo da lì, poi potrai eliminarlo.`
  }
  const rest = count - 3
  return `È usato in ${noun}: ${listed}${PIATTI_FIXED_MENU_LIST_SEPARATOR}${PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX}${rest}. Toglilo da lì, poi potrai eliminarlo.`
}
