export type TAtLeast<T, TK extends keyof T> = Partial<T> & Pick<T, TK>
