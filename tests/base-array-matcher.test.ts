import { describe, expect, it } from 'vitest'
import { type Matchers, useInitxMatcher } from '../src/index'

interface CustomMatcher {
  name: string
}

function resultFn(matcher: CustomMatcher, ...others: string[]) {
  return { matcher, others }
}

describe('initxBaseArrayMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  const matchers: Matchers<CustomMatcher> = [
    {
      matching: [
        'foo',
        /^bar/
      ],
      name: 'first'
    },
    {
      matching: [
        'test',
        /^t/
      ],
      name: 'second'
    }
  ]

  it('should match name first', () => {
    const [firstResultFoo] = matcher.match(matchers, 'foo')
    expect(firstResultFoo.matcher.name).toEqual('first')

    const [firstResultBarfoo] = matcher.match(matchers, 'barfoo')
    expect(firstResultBarfoo.matcher.name).toEqual('first')
  })

  it('should match name second', () => {
    const [secondResultTest] = matcher.match(matchers, 'test')
    expect(secondResultTest.matcher.name).toEqual('second')

    const [secondResultT] = matcher.match(matchers, 't')
    expect(secondResultT.matcher.name).toEqual('second')
  })
})
