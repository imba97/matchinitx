import { describe, expect, it } from 'vitest'
import { useInitxMatcher } from '../src/index'

function resultFn(matcher: any, ...others: string[]) {
  return { matcher, others }
}

describe('initxMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  it('should match with BaseMatchers', () => {
    const matchers = {
      matching: 'testKey'
    }

    const result = matcher.match(matchers, 'testKey', 'extra1')
    expect(result).toEqual([{ matcher: {}, others: ['extra1'] }])
  })

  it('should not match if the key does not match any patterns', () => {
    const matchers = {
      matching: 'testKey1'
    }

    const result = matcher.match(matchers, 'nonMatchingKey', 'extra1')
    expect(result).toEqual([])
  })

  it('should correctly handle multiple arguments', () => {
    const matchers = { matching: 'testKey' }
    const result = matcher.match(matchers, 'testKey', 'extra1', 'extra2')
    expect(result).toEqual([{ matcher: {}, others: ['extra1', 'extra2'] }])
  })
})
