declare module 'turndown' {
  interface TurndownServiceOptions {
    headingStyle?: 'setext' | 'atx'
    hr?: string
    br?: string
    bulletListMarker?: string
    codeBlockStyle?: 'indented' | 'fenced'
    emDelimiter?: string
    strongDelimiter?: string
    linkStyle?: 'inlined' | 'referenced'
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut'
    preformattedCode?: boolean
  }
  class TurndownService {
    constructor(options?: TurndownServiceOptions)
    turndown(html: string): string
    addRule(key: string, rule: { filter: string | string[] | ((node: HTMLElement, options: any) => boolean); replacement: (content: string, node: HTMLElement) => string }): this
    keep(filter: string | string[]): this
    remove(filter: string | string[]): this
  }
  export default TurndownService
}

declare module 'marked' {
  interface MarkedStatic {
    parse(markdownString: string, options?: { async?: boolean; [key: string]: any }): string | Promise<string>
    (markdownString: string, options?: any): string | Promise<string>
    defaults: any
    use(options: any): void
  }
  export const marked: MarkedStatic
}

declare module 'lowlight' {
  export function createLowlight(common: any): any
  export const common: any
}
