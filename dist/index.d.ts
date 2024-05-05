type CSSGlobals = "inherit" | "initial" | "unset";
type StyleRule = {
    color?: string | CSSGlobals;
    fontWeight?: "bold" | "normal" | "lighter" | "bolder" | number | CSSGlobals;
    fontSize?: string | number | CSSGlobals;
};
type FormatterType = {
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
type FormatterConfig = {
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
declare function Formatter(config?: Partial<FormatterConfig>): FormatterType;

declare const Colors: {
    yellow: string;
    blue: string;
    green: string;
    pink: string;
    blueGreen: string;
    red: string;
    gray1: string;
    gray2: string;
    black: string;
    white: string;
};
declare const darkModeTextColors: string[];

export { type CSSGlobals, Colors, Formatter, type FormatterConfig, type FormatterType, type StyleRule, darkModeTextColors };
