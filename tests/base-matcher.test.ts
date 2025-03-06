import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

function resultFn(rule: any, ...others: string[]) {
  return { rule, others }
}

describe('initxBaseMatcher', () => {
  interface CustomField {
    name: string
  }

  type CustomMatcherRule = MatcherRules<CustomField>

  const rule1: CustomMatcherRule = {
    matching: 'foo',
    name: 'fooName'
  }

  const rule2: CustomMatcherRule = {
    matching: /^foo/,
    name: 'barName'
  }

  const matcher = useInitxMatcher<
    { rule: CustomField, others: string[] },
    CustomField
  >(resultFn)

  it('should match matcher1 and matcher2', () => {
    const rules = [rule1, rule2]

    expect(
      matcher.match(rules, 'foo', 'extra')
    )
      .toEqual(
        [
          {
            rule: {
              name: 'fooName'
            },
            others: ['extra']
          },
          {
            rule: {
              name: 'barName'
            },
            others: ['extra']
          }
        ]
      )
  })

  it('should match the matcher2', () => {
    const rules = [rule1, rule2]

    expect(
      matcher.match(rules, 'foobar', 'extra')
    )
      .toEqual(
        [
          {
            rule: {
              name: 'barName'
            },
            others: ['extra']
          }
        ]
      )
  })

  it('should not match if the key does not match any patterns', () => {
    const rule = {
      matching: 'testKey',
      name: 'testName'
    }

    expect(
      matcher.match(rule, 'nonMatchingKey', 'extra')
    )
      .toEqual([])
  })

  it('should correctly handle multiple arguments', () => {
    const rule = { matching: 'testKey', name: 'testName' }

    expect(
      matcher.match(rule, 'testKey', 'extra1', 'extra2')
    )
      .toEqual(
        [
          {
            rule: { name: 'testName' },
            others: ['extra1', 'extra2']
          }
        ]
      )
  })
})
