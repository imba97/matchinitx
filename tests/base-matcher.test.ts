import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

function resultFn(rule: any, ...others: string[]) {
  return { rule, others }
}

describe('initxBaseMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  type CustomMatcherRule = MatcherRules<{
    name: string
  }>

  const rule1: CustomMatcherRule = {
    matching: 'foo',
    name: 'fooName'
  }

  const rule2: CustomMatcherRule = {
    matching: /^foo/,
    name: 'barName'
  }

  it('should match matcher1 and matcher2', () => {
    const rules: CustomMatcherRule[] = [rule1, rule2]

    const fooResult = matcher.match(rules, 'foo', 'extra')

    expect(fooResult).toEqual(
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

    const result = matcher.match(rules, 'foobar', 'extra')

    expect(result).toEqual(
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
      matching: 'testKey'
    }

    const result = matcher.match(rule, 'nonMatchingKey', 'extra')
    expect(result).toEqual([])
  })

  it('should correctly handle multiple arguments', () => {
    const rule = { matching: 'testKey' }
    const result = matcher.match(rule, 'testKey', 'extra1', 'extra2')
    expect(result).toEqual([{ rule: {}, others: ['extra1', 'extra2'] }])
  })
})
