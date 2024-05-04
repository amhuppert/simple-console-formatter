// import { schemeSet3 } from "d3-scale-chromatic";
// import * as d3 from "d3-scale";
import { omitUndefined } from "./utils";

// const COLORS = d3.scaleOrdinal().range(schemeSet3);

export type CSSGlobals = "inherit" | "initial" | "unset";

export type StyleRule = {
  color?: string | CSSGlobals;
  fontWeight?: "bold" | "normal" | "lighter" | "bolder" | number | CSSGlobals;
  fontSize?: string | number | CSSGlobals;
};

export type FormatterType = {
  // --- Basic operations ---
  text(s: string | undefined, indent?: boolean): FormatterType;
  line(s: string): FormatterType;
  newline(numNewlines?: number): FormatterType;
  enclose(
    s: string,
    open: string,
    close?: string,
    space?: boolean
  ): FormatterType;

  // --- Indentation ---
  indent(): FormatterType;
  unindent(): FormatterType;

  // --- Styling primitives ---
  addStyle(style: StyleRule | undefined): FormatterType;
  clearStyles(): FormatterType;
  removeLastStyle(): FormatterType;

  // --- More styling ---

  // --- Run the formatter
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

const DEFAULT_FORMATTER_CONFIG = {
  indentSize: 2,
  defaultStyles: {},
};

const STYLE_DIRECTIVE = "%c";

export function Formatter(config?: Partial<FormatterConfig>): FormatterType {
  const receivedDefault = config?.defaultStyles?.default;
  const defaultDelimiter = config?.defaultStyles?.defaultDelimiter;
  const { indentSize, defaultStyles }: FormatterConfig = {
    indentSize: config?.indentSize ?? DEFAULT_FORMATTER_CONFIG.indentSize,
    defaultStyles: {
      default: config?.defaultStyles?.default,
      defaultDelimiter,
      "{": config?.defaultStyles?.["{"] ?? defaultDelimiter,
      "(": config?.defaultStyles?.["("] ?? defaultDelimiter,
      "[": config?.defaultStyles?.["["] ?? defaultDelimiter,
      '"': config?.defaultStyles?.['"'] ?? defaultDelimiter,
      "'": config?.defaultStyles?.["'"] ?? defaultDelimiter,
      "<": config?.defaultStyles?.["<"] ?? defaultDelimiter,
    },
  };
  const ONE_INDENT = " ".repeat(indentSize);

  let currIndentLevel = 0;
  const indents: string[] = [""];

  const formatString: string[] = [];
  const substitutions: string[] = [];

  // Each style passed to console.log completely replaces the previous one.
  // But we will improve on this by merging the new style with the previous one before adding it.
  const styleStack: StyleRule[] = [];

  const getIndent = () => {
    return indents[currIndentLevel];
  };

  const self: FormatterType = {
    text: (s, indent = false) => {
      if (s !== undefined) {
        formatString.push("%s");
        substitutions.push(indent ? getIndent() + s : s);
      }
      return self;
    },
    line: (s) => {
      return self.text(s + "\n", true);
    },
    newline: (numNewlines = 1) => {
      return self.text("\n".repeat(numNewlines));
    },
    indent: () => {
      const currIndent = getIndent();
      currIndentLevel++;
      if (currIndentLevel >= indents.length) {
        indents.push(currIndent + ONE_INDENT);
      }
      return self;
    },
    unindent: () => {
      if (currIndentLevel > 0) {
        currIndentLevel--;
      }
      return self;
    },
    addStyle: (style: StyleRule | undefined) => {
      if (style) {
        const currentStyles =
          styleStack[styleStack.length - 1] ?? defaultStyles.default;
        const mergedStyles = { ...currentStyles, ...style };
        styleStack.push(mergedStyles);
        formatString.push(STYLE_DIRECTIVE);
        substitutions.push(styleRuleToCSS(mergedStyles));
      }
      return self;
    },
    clearStyles: () => {
      styleStack.length = 0;
      formatString.push(STYLE_DIRECTIVE);
      substitutions.push("");
      return self;
    },
    removeLastStyle: () => {
      styleStack.pop();

      // Restore the styles that came before
      const previousStyles =
        (styleStack[styleStack.length - 1] as StyleRule | undefined) ??
        defaultStyles.default;
      formatString.push(STYLE_DIRECTIVE);
      substitutions.push(previousStyles ? styleRuleToCSS(previousStyles) : "");

      return self;
    },
    enclose: (s: string, open: string, close?: string, space = false) => {
      close = close ?? open;
      const delimStyle =
        (defaultStyles as Record<string, StyleRule | undefined>)[open] ??
        defaultStyles.defaultDelimiter;
      const maybeRemoveLastStyle = () =>
        delimStyle ? self.removeLastStyle() : self;
      const maybeAddSpace = () => (space ? self.text(" ") : self);

      self.addStyle(delimStyle).text(open);
      maybeRemoveLastStyle();
      maybeAddSpace();
      self.text(s);
      maybeAddSpace();
      self.addStyle(delimStyle).text(close);
      return maybeRemoveLastStyle();
    },
    getConsoleArgs: () => [formatString.join(""), ...substitutions],
    log: () => console.log(...self.getConsoleArgs()),
  };

  self.addStyle(defaultStyles.default);
  return self;
}

function styleRuleToCSS(style: StyleRule | undefined) {
  if (!style) {
    return "";
  }
  const rules: string[] = [];
  if (style.color !== undefined) {
    rules.push(`color: ${style.color}`);
  }
  if (style.fontWeight !== undefined) {
    rules.push(`font-weight: ${style.fontWeight}`);
  }
  if (style.fontSize !== undefined) {
    rules.push(`font-size: ${style.fontSize}`);
  }
  return rules.join("; ");
}
