import { describe, expect, it } from 'vitest'
import { type Matchers, useInitxMatcher } from '../src/index'

function resultFn(matcher: any, ...others: string[]) {
  return { matcher, others }
}

describe('initxBaseMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  type CustomMatchers = Matchers<{
    name: string
  }>

  const matcher1: CustomMatchers = {
    matching: 'foo',
    name: 'fooName'
  }

  const matcher2: CustomMatchers = {
    matching: /^foo/,
    name: 'barName'
  }

  it('should match matcher1 and matcher2', () => {
    const matchers = [matcher1, matcher2]

    const fooResult = matcher.match(matchers, 'foo', 'extra')

    expect(fooResult).toEqual(
      [
        {
          matcher: {
            name: 'fooName'
          },
          others: ['extra']
        },
        {
          matcher: {
            name: 'barName'
          },
          others: ['extra']
        }
      ]
    )
  })

  it('should match the matcher2', () => {
    const matchers = [matcher1, matcher2]

    const result = matcher.match(matchers, 'foobar', 'extra')

    expect(result).toEqual(
      [
        {
          matcher: {
            name: 'barName'
          },
          others: ['extra']
        }
      ]
    )
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
