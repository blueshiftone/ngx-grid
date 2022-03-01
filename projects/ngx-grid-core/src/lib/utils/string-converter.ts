const  addSeparator      = (s: string, separator: string) => sanitizeAsPascale(s).replace(/(?!^)([A-Z])/g, `${separator}$1`)
const  sanitizeAsPascale = (s: string) => s[0].toUpperCase() + s.substr(1).replace(/([-_]\w)/g, g => g[1].toUpperCase())
const  pascalToCamel     = (s: string) => s.charAt(0).toLowerCase() + s.substr(1)

export const TO_PASCALE  = (s: string) => sanitizeAsPascale(s)
export const TO_SNAKE    = (s: string) => addSeparator(s, '_').toLowerCase()
export const TO_KEBAB    = (s: string) => addSeparator(s, '-').toLowerCase()
export const TO_CAMEL    = (s: string) => pascalToCamel(TO_PASCALE(s))
export const TO_SENTENCE = (s: string) => addSeparator(s, ' ')
