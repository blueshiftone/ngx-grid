export const TO_ARRAY = <T>(ar: T | T[]): T[] => (Array.isArray(ar) ? ar : [ar])
