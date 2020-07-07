interface Options {
    separator?: string;
}
declare function wildcardMatch(pattern: string | string[], separator?: string | Options): RegExp & {
    pattern?: string | string[] | undefined;
    options: Options;
};
export = wildcardMatch;
