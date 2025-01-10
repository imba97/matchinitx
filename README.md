<h1 align="center">matchinitx</h1>

<p align="center">A good matcher</p>

## Usage

Install the package

```bash
pnpm add matchinitx
```

Import the package

```ts
import { type MatcherRules, useInitxMatcher } from 'matchinitx'
```

### Basic usage

```ts
interface CustomField {
  name: string
}

function resultFn(rule: CustomField, ...others: string[]) {
  return { rule, others }
}

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

const matcher = useInitxMatcher(resultFn)

matcher.match(rules, 'foo')
// [{ rule: { name: 'first' }, others: [] }]

matcher.match(rules, 'barfoo')
// [{ rule: { name: 'first' }, others: [] }]

matcher.match(rules, 'test')
// [{ rule: { name: 'second' }, others: [] }]

matcher.match(rules, 'top', 'extra')
// [{ rule: { name: 'second' }, others: ['extra'] }]
```

### Type matcher

```ts
interface CustomField {
  title: string
}

function resultFn(rule: CustomField, type: string, ...others: string[]) {
  return { rule, type, others }
}

enum CustomType {
  FOO = 'foo',
  BAR = 'bar'
}

const rules: MatcherRules<CustomField> = {
  [CustomType.FOO]: {
    matching: [
      'f',
      'o'
    ],
    title: 'a good matcher'
  },
  [CustomType.BAR]: {
    matching: [
      'b',
      'a'
    ],
    title: 'a good title'
  }
}

const matcher = useInitxMatcher(resultFn)

matcher.match(rules, 'f')
matcher.match(rules, 'o')
// [{ rule: { title: 'a good matcher' }, type: 'foo', others: [] }]

matcher.match(rules, 'b', 'extra')
matcher.match(rules, 'a', 'extra')
// [{ rule: { title: 'a good title' }, type: 'bar', others: ['extra'] }]
```
