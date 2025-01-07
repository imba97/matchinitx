import { describe, expect, it } from 'vitest'
import { useInitxMatcher } from '../src/index'

function resultFn(matcher: any, ...others: string[]) {
  return { matcher, others }
}

describe('initxTypeMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  it('should match with TypeMatchers', () => {
    const matchers = {
      type1: { matching: 'testKey1' },
      type2: { matching: 'testKey2' }
    }

    const result = matcher.match(matchers, 'testKey2', 'extra2')
    console.log('result', result)
    expect(result).toEqual([{ matcher: {}, others: ['type2', 'extra2'] }])
  })
})
