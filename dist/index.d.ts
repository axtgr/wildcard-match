interface MatchFn {
    (sample: string): boolean;
    pattern: string;
}
declare function wildcardMatch(pattern: string, separator?: string): MatchFn;
export = wildcardMatch;
