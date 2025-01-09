export function ParseDateTime(dateStr: string) {
    if (!dateStr) return undefined
    try {
        return new Date(dateStr)
    } catch (error) {
        return undefined
    }
}
