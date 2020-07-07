declare function wildcardMatch(pattern: string, separator?: string): RegExp & {
    separator?: string | undefined;
};
export = wildcardMatch;
