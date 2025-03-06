import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

enum CustomType {
  FOO = 'foo',
  BAR = 'bar'
}

interface CustomField {
  name: string
}

interface CustomResult {
  rule: CustomField
  type: CustomType
  others: string[]
}

function resultFn(rule: CustomField, ...others: string[]) {
  return { rule, others }
}

function resultTypeFn(rule: CustomField, type: CustomType, ...others: string[]): CustomResult {
  return { rule, type, others }
}

describe('initxTypeMatcher', () => {
  it('should match with TypeMatchers', () => {
    const matcher = useInitxMatcher(resultFn)

    const rules: MatcherRules<CustomField> = {
      type1: { matching: 'testKey1', name: 'name1' },
      type2: { matching: 'testKey2', name: 'name2' }
    }

    expect(
      matcher.match(rules, 'testKey2', 'extra2')
    )
      .toEqual(
        [
          {
            rule: { name: 'name2' },
            others: ['type2', 'extra2']
          }
        ]
      )
  })

  it('use resultTypeFn', () => {
    const matcher = useInitxMatcher(resultTypeFn)

    const rules: MatcherRules<CustomField> = {
      [CustomType.FOO]: { matching: 'testKey1', name: 'name1' },
      [CustomType.BAR]: { matching: 'testKey2', name: 'name2' }
    }

    expect(
      matcher.match(rules, 'testKey1', 'extra')
    )
      .toEqual(
        [
          {
            rule: { name: 'name1' },
            type: CustomType.FOO,
            others: ['extra']
          }
        ]
      )

    expect(
      matcher.match(rules, 'testKey2', 'extra')
    )
      .toEqual(
        [
          {
            rule: { name: 'name2' },
            type: CustomType.BAR,
            others: ['extra']
          }
        ]
      )
  })
})
