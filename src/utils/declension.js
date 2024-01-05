export const declension = (forms, val) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return forms[val % 100 > 4 && val % 100 < 20 ? 2 : cases[val % 10 < 5 ? val % 10 : 5]]
}
