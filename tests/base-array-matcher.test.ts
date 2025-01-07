import { describe, expect, it } from 'vitest'
import { useInitxMatcher } from '../src/index'

function resultFn(matcher: any, ...others: string[]) {
  return { matcher, others }
}

describe('initxBaseArrayMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  it('should match with an array of BaseMatchers', () => {
    const matchers = [
      { matching: 'testKey1' },
      { matching: 'testKey2' }
    ]

    const result = matcher.match(matchers, 'testKey2', 'extra1')
    expect(result).toEqual([{ matcher: {}, others: ['extra1'] }])
  })
})
