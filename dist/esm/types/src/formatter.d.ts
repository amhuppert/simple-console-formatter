export type CSSGlobals = "inherit" | "initial" | "unset";
export type StyleRule = {
    color?: string | CSSGlobals;
    fontWeight?: "bold" | "normal" | "lighter" | "bolder" | number | CSSGlobals;
    fontSize?: string | number | CSSGlobals;
};
export type FormatterType = {
    text(s: string | undefined, indent?: boolean): FormatterType;
    line(s: string): FormatterType;
    newline(numNewlines?: number): FormatterType;
    enclose(s: string | ((s: FormatterType) => void), open: string, close?: string, space?: boolean): FormatterType;
    indent(): FormatterType;
    unindent(): FormatterType;
    addStyle(style: StyleRule | undefined): FormatterType;
    clearStyles(): FormatterType;
    removeLastStyle(): FormatterType;
    style(s: string, style: StyleRule): FormatterType;
    colored(s: string, color: string): FormatterType;
    getConsoleArgs(): string[];
    log(): void;
};
export type FormatterConfig = {
    indentSize: number;
    defaultStyles: {
        default?: StyleRule;
        defaultDelimiter?: StyleRule;
        "{"?: StyleRule;
        "("?: StyleRule;
        "["?: StyleRule;
        '"'?: StyleRule;
        "'"?: StyleRule;
        "<"?: StyleRule;
    };
};
export declare function Formatter(config?: Partial<FormatterConfig>): FormatterType;
//# sourceMappingURL=formatter.d.ts.map