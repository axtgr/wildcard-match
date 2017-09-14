export = wildcardMatch

declare function wildcardMatch(
  delimiter: string,
  sample1: string,
  sample2: string
): boolean

declare function wildcardMatch(
  sample1: string | string[],
  sample2: string | string[]
): boolean
