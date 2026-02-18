import { MOCK_PROPERTIES, type MockProperty } from '@/mocks/properties'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function searchMockProperties(q: string): MockProperty[] {
  const term = normalize(q)
  if (!term) return []
  return MOCK_PROPERTIES.filter(p =>
    [p.code, p.title, p.address, p.city]
      .map(normalize)
      .some(field => field.includes(term))
  )
}

export default searchMockProperties
