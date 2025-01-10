import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

interface CustomField {
  name: string
}

function resultFn(matcher: CustomField, ...others: string[]) {
  return { matcher, others }
}

describe('initxBaseArrayMatcher', () => {
  const matcher = useInitxMatcher(resultFn)

  const rules: MatcherRules<CustomField> = [
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
    const [firstResultFoo] = matcher.match(rules, 'foo')
    expect(firstResultFoo.matcher.name).toEqual('first')

    const [firstResultBarfoo] = matcher.match(rules, 'barfoo')
    expect(firstResultBarfoo.matcher.name).toEqual('first')
  })

  it('should match name second', () => {
    const [secondResultTest] = matcher.match(rules, 'test')
    expect(secondResultTest.matcher.name).toEqual('second')

    const [secondResultT] = matcher.match(rules, 't')
    expect(secondResultT.matcher.name).toEqual('second')
  })
})
