interface MatchFn {
    (sample: string): boolean;
    pattern: string;
}
declare function wildcardMatch(pattern: string, separator?: string): MatchFn;
declare namespace wildcardMatch {
    var default: typeof wildcardMatch;
}
export = wildcardMatch;
