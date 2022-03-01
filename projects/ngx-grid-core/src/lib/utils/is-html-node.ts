export function IsHTMLNode(node: Node | null | undefined): boolean {
  if (!node) return false
  return node.nodeType === 1
}
