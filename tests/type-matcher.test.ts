import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

enum CustomType {
  FOO = 'foo',
  BAR = 'bar'
}

function resultFn(rule: any, ...others: string[]) {
  return { rule, others }
}

interface CustomResult {
  rule: object
  type: CustomType
  others: string[]
}

function resultTypeFn(rule: any, type: CustomType, ...others: string[]): CustomResult {
  return { rule, type, others }
}

describe('initxTypeMatcher', () => {
  it('should match with TypeMatchers', () => {
    const matcher = useInitxMatcher(resultFn)

    const rules: MatcherRules = {
      type1: { matching: 'testKey1' },
      type2: { matching: 'testKey2' }
    }

    const result = matcher.match(rules, 'testKey2', 'extra2')
    expect(result).toEqual([{ rule: {}, others: ['type2', 'extra2'] }])
  })

  it('use resultTypeFn', () => {
    const matcher = useInitxMatcher(resultTypeFn)

    const rules: MatcherRules = {
      [CustomType.FOO]: { matching: 'testKey1' },
      [CustomType.BAR]: { matching: 'testKey2' }
    }

    const result1 = matcher.match(rules, 'testKey1', 'extra')
    expect(result1).toEqual([{ rule: {}, type: CustomType.FOO, others: ['extra'] }])

    const result2 = matcher.match(rules, 'testKey2', 'extra')
    expect(result2).toEqual([{ rule: {}, type: CustomType.BAR, others: ['extra'] }])
  })
})
