import { describe, expect, it } from 'vitest'
import { type MatcherRules, useInitxMatcher } from '../src/index'

interface CustomField {
  name: string
}

function resultFn(rule: CustomField, ...others: string[]) {
  return { rule, others }
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
    expect(firstResultFoo.rule.name).toEqual('first')

    const [firstResultBarfoo] = matcher.match(rules, 'barfoo')
    expect(firstResultBarfoo.rule.name).toEqual('first')
  })

  it('should match name second', () => {
    const [secondResultTest] = matcher.match(rules, 'test')
    expect(secondResultTest.rule.name).toEqual('second')

    const [secondResultT] = matcher.match(rules, 't')
    expect(secondResultT.rule.name).toEqual('second')
  })
})
