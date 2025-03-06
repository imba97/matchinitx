type MaybeArray<T> = T | T[]

interface MatcherRuleSetup {
  /**
   * Matching string or RegExp
   *
   * The key that was used to match the handler
   */
  matching: MaybeArray<string | RegExp>
}

type BaseMatcherRules<TRule> = TRule & MatcherRuleSetup
type TypeMatcherRules<TRule> = Record<string, BaseMatcherRules<TRule>>

type ResultFunctionNoType<TResult, TRule> = (rule: TRule, ...others: string[]) => TResult
type ResultFunctionHasType<TResult, TRule, TType> = (rule: TRule, type: TType, ...others: string[]) => TResult

type ResultFunction<TResult, TRule, TType>
  = TType extends undefined
    ? ResultFunctionNoType<TResult, TRule>
    : ResultFunctionHasType<TResult, TRule, TType>

export type MatcherRules<TRule extends object = object>
  = MaybeArray<BaseMatcherRules<TRule>>
  | TypeMatcherRules<TRule>

class InitxMatcher<TResult, TRule extends object, TType> {
  private resultFunction: ResultFunction<TResult, TRule, TType>

  constructor(fn: ResultFunction<TResult, TRule, TType>) {
    this.resultFunction = fn
  }

  public match(rules: MatcherRules<TRule>, key: string, ...others: string[]): TResult[] {
    // BaseRules
    if (this.isBaseRules(rules)) {
      return this.matchBaseRules(rules, key, ...others)
    }

    // Array<BaseRules>
    if (this.isArrayBaseRules(rules)) {
      return this.matchArrayBaseRules(rules, key, ...others)
    }

    // TypeRules
    if (this.isObject(rules)) {
      return this.matchTypeRules(rules, key, ...others)
    }

    return []
  }

  // BaseRules
  private matchBaseRules(rules: BaseMatcherRules<TRule>, key: string, ...others: string[]) {
    if (!this.isPassed(rules.matching, key)) {
      return []
    }

    return this.alwaysArray(
      (this.buildResultFunction as ResultFunctionNoType<TResult, TRule>)(rules, ...others)
    )
  }

  private matchArrayBaseRules(rules: BaseMatcherRules<TRule>[], key: string, ...others: string[]) {
    const results: TResult[] = []

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const isPassed = this.isPassed(rule.matching, key)

      if (isPassed) {
        results.push(
          (this.buildResultFunction as ResultFunctionNoType<TResult, TRule>)(rule, ...others)
        )
      }
    }

    return results
  }

  private matchTypeRules(rules: TypeMatcherRules<TRule>, key: string, ...others: string[]) {
    const results: TResult[] = []
    const keys = Object.keys(rules)

    for (let i = 0; i < keys.length; i++) {
      const rule = rules[keys[i]]
      const isPassed = this.isPassed(rule.matching, key)

      if (isPassed) {
        results.push(
          this.buildResultFunction(rule, keys[i] as TType, ...others)
        )
      }
    }

    return results
  }

  private isBaseRules(rules: MatcherRules<TRule>): rules is BaseMatcherRules<TRule> {
    const keys = Object.keys(rules)

    const requiredKeys: [keyof MatcherRuleSetup] = ['matching']

    return (
      this.isObject(rules)
      && requiredKeys.every(key => keys.includes(key))
    )
  }

  private isArrayBaseRules(rules: MatcherRules<TRule>): rules is BaseMatcherRules<TRule>[] {
    return Array.isArray(rules) && rules.every(this.isBaseRules.bind(this))
  }

  private alwaysArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value]
  }

  private isObject(value: any): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !(Array.isArray(value))
  }

  private isPassed(rules: MatcherRuleSetup['matching'], key: string): boolean {
    const tests = Array.isArray(rules) ? rules : [rules]

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

  private buildResultMatcher(rules: BaseMatcherRules<TRule>) {
    return this.omit<TRule>(rules, ['matching'])
  }

  private buildResultFunction(rules: BaseMatcherRules<TRule>, ...others: [TType, ...string[]]): TResult {
    const buildedMatcher = this.buildResultMatcher(rules)
    const [type, ...rest] = others
    return (this.resultFunction as ResultFunctionHasType<TResult, TRule, TType>)(
      buildedMatcher,
      type,
      ...rest
    )
  }
}

export function useInitxMatcher<
  TResult,
  TRule extends object = object,
  TType = undefined
>(fn: ResultFunction<TResult, TRule, TType>) {
  return new InitxMatcher<TResult, TRule, TType>(fn)
}
