/// <reference types="vite/client" />

// turndown は型定義がないので簡易宣言
declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'atx' | 'setext'
    codeBlockStyle?: 'fenced' | 'indented'
    emDelimiter?: '*' | '_'
    bulletListMarker?: '-' | '+' | '*'
    linkStyle?: 'inlined' | 'referenced'
  }
  class TurndownService {
    constructor(options?: TurndownOptions)
    turndown(html: string): string
    addRule(key: string, rule: { filter: string | string[]; replacement: (content: string, node: HTMLElement) => string }): this
  }
  export default TurndownService
}
