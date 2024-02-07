export const DeepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (Array.isArray(obj)) return obj.map(item => DeepClone(item)) as T
    if (obj instanceof Object) {
        const clonedObj = {} as T
        Object.keys(obj).forEach((key) => {
            (clonedObj as any)[key] = DeepClone((obj as any)[key])
        })
        return clonedObj
    }
    return obj
}