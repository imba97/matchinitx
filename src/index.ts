type MaybeArray<T> = T | T[]

interface MatcherRuleSetup {
  /**
   * Matching string or RegExp
   *
   * The key that was used to match the handler
   */
  matching: MaybeArray<string | RegExp>
}

type BaseMatcherRules<TMatcher> = TMatcher & MatcherRuleSetup
type TypeMatcherRules<TMatcher> = Record<string, BaseMatcherRules<TMatcher>>

type ResultFunction<TResult, TMatcher> = (matcher: TMatcher, ...others: string[]) => TResult

export type MatcherRules<TMatcher extends object = object> = MaybeArray<BaseMatcherRules<TMatcher>> | TypeMatcherRules<TMatcher>

class InitxMatcher<TResult, TMatcher extends object> {
  private resultFunction: ResultFunction<TResult, TMatcher>

  constructor(fn: ResultFunction<TResult, TMatcher>) {
    this.resultFunction = fn
  }

  public match(matchers: MatcherRules<TMatcher>, key: string, ...others: string[]): TResult[] {
    // BaseMatchers
    if (this.isBaseMatchers(matchers)) {
      return this.matchBaseMatchers(matchers, key, ...others)
    }

    // Array<BaseMatchers>
    if (this.isArrayBaseMatchers(matchers)) {
      return this.matchArrayBaseMatchers(matchers, key, ...others)
    }

    // TypeMatchers
    if (this.isObject(matchers)) {
      return this.matchTypeMatchers(matchers as TypeMatcherRules<TMatcher>, key, ...others)
    }

    return []
  }

  // BaseMatchers
  private matchBaseMatchers(matchers: BaseMatcherRules<TMatcher>, key: string, ...others: string[]) {
    if (!this.isPassed(matchers.matching, key)) {
      return []
    }

    return this.alwaysArray(
      this.buildResultFunction(matchers, ...others)
    )
  }

  private matchArrayBaseMatchers(matchers: BaseMatcherRules<TMatcher>[], key: string, ...others: string[]) {
    const handlers: TResult[] = []

    for (let i = 0; i < matchers.length; i++) {
      const matcher = matchers[i]
      const isPassed = this.isPassed(matcher.matching, key)

      if (isPassed) {
        handlers.push(
          this.buildResultFunction(matcher, ...others)
        )
      }
    }

    return handlers
  }

  private matchTypeMatchers(matchers: TypeMatcherRules<TMatcher>, key: string, ...others: string[]) {
    const handlers: TResult[] = []
    const keys = Object.keys(matchers)

    for (let i = 0; i < keys.length; i++) {
      const matcher = matchers[keys[i]]
      const isPassed = this.isPassed(matcher.matching, key)

      if (isPassed) {
        handlers.push(
          this.buildResultFunction(matcher, keys[i], ...others)
        )
      }
    }

    return handlers
  }

  private isBaseMatchers(matchers: MatcherRules<TMatcher>): matchers is BaseMatcherRules<TMatcher> {
    const keys = Object.keys(matchers)

    const requiredKeys: [keyof MatcherRuleSetup] = ['matching']

    return (
      this.isObject(matchers)
      && requiredKeys.every(key => keys.includes(key))
    )
  }

  private isArrayBaseMatchers(matchers: MatcherRules<TMatcher>): matchers is BaseMatcherRules<TMatcher>[] {
    return Array.isArray(matchers) && matchers.every(this.isBaseMatchers.bind(this))
  }

  private alwaysArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value]
  }

  private isObject(value: any): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !(Array.isArray(value))
  }

  private isPassed(matchers: MatcherRuleSetup['matching'], key: string): boolean {
    const tests = Array.isArray(matchers) ? matchers : [matchers]

    return tests.some((test) => {
      if (typeof test === 'string') {
        return test === key
      }

      return test.test(key)
    })
  }

  private omit<T>(obj: Record<string, any>, keys: string[]) {
    const result: Record<string, any> = {}

    for (const key in obj) {
      if (!keys.includes(key)) {
        result[key] = obj[key] as unknown
      }
    }

    return result as T
  }

  private buildResultMatcher(matcher: BaseMatcherRules<TMatcher>) {
    return this.omit<TMatcher>(matcher, ['matching'])
  }

  private buildResultFunction(matcher: BaseMatcherRules<TMatcher>, ...others: string[]): TResult {
    const buildedMatcher = this.buildResultMatcher(matcher)
    return this.resultFunction(
      buildedMatcher,
      ...others
    )
  }
}

export function useInitxMatcher<
  TResult,
  TMatcher extends object = object
>(fn: ResultFunction<TResult, TMatcher>) {
  return new InitxMatcher<TResult, TMatcher>(fn)
}
