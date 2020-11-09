import wcmatch from '../build'

export default function (t) {
  t.test('Basic', (t) => {
    t.equal(wcmatch('pattern').pattern, 'pattern')
    t.equal(wcmatch('pattern').options, {})
    t.ok(wcmatch('pattern').regexp instanceof RegExp)
  })

  t.test('Passes the given flags to the regexp', (t) => {
    let isMatch = wcmatch('pattern', { flags: 'ig' })
    t.equal(isMatch.regexp.flags, 'gi')
  })

  t.test('No wildcards', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('')(''))
      t.ok(wcmatch('/')('/'))
      t.ok(wcmatch('one')('one'))
      t.ok(wcmatch('one/two')('one/two'))
      t.ok(wcmatch('')('/'))
      t.notOk(wcmatch('a/b')('a.b'))
      t.notOk(wcmatch('one')('two'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('one', '/')('one'))
      t.ok(wcmatch('two', '/')('two'))
      t.ok(wcmatch('one/two', '/')('one/two'))
      t.ok(wcmatch('one/two/three', '/')('one/two/three'))
      t.ok(wcmatch('one.two', '/')('one.two'))
      t.ok(wcmatch('', '/')(''))
      t.ok(wcmatch('one//', '/')('one//'))
      t.ok(wcmatch('/', '/')('/'))
      t.ok(wcmatch(' ', '/')(' '))
      t.ok(wcmatch('/one/', '/')('/one/'))
      t.notOk(wcmatch('one', '/')('two'))
      t.notOk(wcmatch('two', '/')('one'))
      t.notOk(wcmatch('one/two', '/')('one/three'))
      t.notOk(wcmatch('one/two/three', '/')('one/two/four'))
      t.notOk(wcmatch('one', '/')('one.two'))
      t.notOk(wcmatch('one.two', '/')('one'))
      t.notOk(wcmatch('', '/')('one'))
      t.notOk(wcmatch('one', '/')('one '))
      t.notOk(wcmatch(' one', '/')('one'))
      t.notOk(wcmatch('one.two', '/')('one.two.three'))
      t.notOk(wcmatch('', '/')('**'))
      t.notOk(wcmatch('', '/')('*'))
      t.notOk(wcmatch('/', '/')(''))
      t.notOk(wcmatch('/', '/')('one/'))
      t.notOk(wcmatch('/', '/')('/one'))
      t.notOk(wcmatch('', '/')(' '))
      t.notOk(wcmatch('/', '/')(' '))
      t.notOk(wcmatch('/', '/')(' /'))
      t.notOk(wcmatch('/', '/')('/ '))
      t.notOk(wcmatch('/', '/')(' / '))
      t.notOk(wcmatch('one/two', '/')('one/*'))
      t.notOk(wcmatch('one/two', '/')('one/**'))
      t.notOk(wcmatch('one/two/three', '/')('one/*/three'))
    })
  })

  t.test('?', (t) => {
    t.test('No separator given - matches 1 arbitrary char', (t) => {
      t.ok(wcmatch('?')('o'))
      t.ok(wcmatch('on?')('one'))
      t.ok(wcmatch('???')('one'))
      t.ok(wcmatch('???')('two'))
      t.notOk(wcmatch('?')('/'))
      t.notOk(wcmatch('one?two')('one/two'))
      t.notOk(wcmatch('?')(''))
      t.notOk(wcmatch('?')('on'))
      t.notOk(wcmatch('??e')('on'))
      t.notOk(wcmatch('one?')('one'))
    })

    t.test('Separator given - matches 1 non-separator char', (t) => {
      t.ok(wcmatch('?', '/')('a'))
      t.ok(wcmatch('?', '/')(' '))
      t.ok(wcmatch('??', '/')('ab'))
      t.ok(wcmatch('??', '/')(' b'))
      t.ok(wcmatch('???', '/')('one'))
      t.ok(wcmatch('o?e', '/')('one'))
      t.ok(wcmatch('?ne', '/')('one'))
      t.ok(wcmatch('?ne', '/')('ane'))
      t.ok(wcmatch('on?', '/')('one'))
      t.ok(wcmatch('on?', '/')('ont'))
      t.ok(wcmatch('o??', '/')('one'))
      t.ok(wcmatch('o??', '/')('ota'))
      t.ok(wcmatch('?n?', '/')('one'))
      t.ok(wcmatch('one/t?o', '/')('one/two'))
      t.ok(wcmatch('one/tw?', '/')('one/two'))
      t.ok(wcmatch('o?e/tw?', '/')('one/two'))
      t.notOk(wcmatch('?', '/')(''))
      t.notOk(wcmatch('?', '/')('/'))
      t.notOk(wcmatch('?', '/')('/o'))
      t.notOk(wcmatch('?', '/')('on'))
      t.notOk(wcmatch('?', '/')('o/n'))
      t.notOk(wcmatch('??', '/')(''))
      t.notOk(wcmatch('??', '/')('/'))
      t.notOk(wcmatch('??', '/')('//'))
      t.notOk(wcmatch('??', '/')('o'))
      t.notOk(wcmatch('??', '/')('on/e'))
      t.notOk(wcmatch('??', '/')('one'))
      t.notOk(wcmatch('???', '/')('on'))
      t.notOk(wcmatch('???', '/')('/on'))
      t.notOk(wcmatch('???', '/')('one/two'))
      t.notOk(wcmatch('???', '/')('/'))
      t.notOk(wcmatch('???', '/')('///'))
      t.notOk(wcmatch('o?e', '/')('oe'))
      t.notOk(wcmatch('?ne', '/')('ne'))
      t.notOk(wcmatch('on?', '/')('on'))
      t.notOk(wcmatch('on?', '/')('on/'))
      t.notOk(wcmatch('?one', '/')('one'))
      t.notOk(wcmatch('?one', '/')('/one'))
      t.notOk(wcmatch('o??', '/')('o//'))
      t.notOk(wcmatch('o??', '/')('o/e'))
      t.notOk(wcmatch('o??', '/')('o'))
      t.notOk(wcmatch('o??', '/')('on/e'))
      t.notOk(wcmatch('o???', '/')('on/e'))
      t.notOk(wcmatch('one?two', '/')('one/two'))
      t.notOk(wcmatch('one/t?o', '/')('one/to'))
      t.notOk(wcmatch('one/tw?', '/')('one/tw/'))
      t.notOk(wcmatch('o?e/tw?', '/')('onetwo'))
    })
  })

  t.test('*', (t) => {
    t.test('No separator given - matches 0 or more arbitrary chars', (t) => {
      t.ok(wcmatch('*')(''))
      t.ok(wcmatch('*')('/'))
      t.ok(wcmatch('*')('one'))
      t.ok(wcmatch('one*')('one'))
      t.notOk(wcmatch('one*')('one/two'))
      t.notOk(wcmatch('one*')('on'))
      t.notOk(wcmatch('one*')('ont'))
      t.notOk(wcmatch('one*')('onte'))
    })

    t.test('Separator given - matches 0 or more non-separator chars', (t) => {
      t.ok(wcmatch('*', '/')(''))
      t.ok(wcmatch('*', '/')('one'))
      t.ok(wcmatch('*', '/')('/'))
      t.ok(wcmatch('*', '/')('//'))
      t.ok(wcmatch('*', '/')('one/'))
      t.ok(wcmatch('*/*', '/')('one/two'))
      t.ok(wcmatch('*/*', '/')('one/'))
      t.ok(wcmatch('*/*', '/')('one/ '))
      t.ok(wcmatch('*/*/*', '/')('one/two/three'))
      t.ok(wcmatch('*/*/*', '/')('//'))
      t.ok(wcmatch('one/*', '/')('one/two'))
      t.ok(wcmatch('one/*', '/')('one/*'))
      t.ok(wcmatch('one/*', '/')('one/**'))
      t.ok(wcmatch('one/*', '/')('one/***'))
      t.ok(wcmatch('one/*', '/')('one/'))
      t.ok(wcmatch('one/*', '/')('one/ '))
      t.ok(wcmatch('one/*/three', '/')('one/two/three'))
      t.ok(wcmatch('one/*/three/', '/')('one/two/three/'))
      t.ok(wcmatch('one/*/three/*', '/')('one/two/three/'))
      t.ok(wcmatch('one/*/three/*', '/')('one/two/three/four'))
      t.ok(wcmatch('one*', '/')('one'))
      t.ok(wcmatch('*two', '/')('two'))
      t.ok(wcmatch('one*', '/')('onetwo'))
      t.ok(wcmatch('*two', '/')('onetwo'))
      t.ok(wcmatch('one*three', '/')('onetwothree'))
      t.ok(wcmatch('one*three', '/')('onethree'))
      t.ok(wcmatch('one/*three', '/')('one/twothree'))
      t.ok(wcmatch('one/two*', '/')('one/twothree'))
      t.ok(wcmatch('*/', '/')('/'))
      t.ok(wcmatch('*/one', '/')('/one'))
      t.ok(wcmatch('*n*', '/')('one'))
      t.ok(wcmatch('*n*', '/')('oonee'))
      t.ok(wcmatch('*n*', '/')('n'))
      t.ok(wcmatch('*n*', '/')('n/'))
      t.ok(wcmatch('*n*', '/')('one/'))
      t.ok(wcmatch('o*n*e', '/')('one'))
      t.ok(wcmatch('o*n*e', '/')('one/'))
      t.ok(wcmatch('o*n*e', '/')('oone'))
      t.ok(wcmatch('o*n*e', '/')('onne'))
      t.ok(wcmatch('o*n*e', '/')('oonne'))
      t.ok(wcmatch('*ne/*o', '/')('ne/o'))
      t.ok(wcmatch('*ne/*o', '/')('one/o'))
      t.ok(wcmatch('*ne/*o', '/')('ne/two'))
      t.ok(wcmatch('*ne/*o', '/')('one/two'))
      t.ok(wcmatch('*/*o', '/')('/o'))
      t.ok(wcmatch('*/*o', '/')('/two'))
      t.ok(wcmatch('*/*o', '/')('one/two'))
      t.ok(wcmatch('*/*o', '/')('//o'))
      t.ok(wcmatch('*/*o', '/')('/o/'))
      t.notOk(wcmatch('*', '/')('one/two'))
      t.notOk(wcmatch('*', '/')('/one'))
      t.notOk(wcmatch('one/*', '/')(''))
      t.notOk(wcmatch('one/*', '/')('/'))
      t.notOk(wcmatch('one/*', '/')('//'))
      t.notOk(wcmatch('one/*', '/')('one/two/three'))
      t.notOk(wcmatch('one/*', '/')('one'))
      t.notOk(wcmatch('one/*', '/')('/one'))
      t.notOk(wcmatch('one/*', '/')('two/three'))
      t.notOk(wcmatch('*/one', '/')(''))
      t.notOk(wcmatch('*/one', '/')('/'))
      t.notOk(wcmatch('*/one', '/')('//'))
      t.notOk(wcmatch('*/one', '/')('one/two/three'))
      t.notOk(wcmatch('*/one', '/')('one'))
      t.notOk(wcmatch('*/one', '/')('one/'))
      t.notOk(wcmatch('*/one', '/')('one/two'))
      t.notOk(wcmatch('*two', '/')('one/two'))
      t.notOk(wcmatch('*n*', '/')(''))
      t.notOk(wcmatch('*n*', '/')('/'))
      t.notOk(wcmatch('*n*', '/')('/n'))
      t.notOk(wcmatch('*n*', '/')('/n/'))
      t.notOk(wcmatch('o*n*e', '/')('/one'))
      t.notOk(wcmatch('o*n*e', '/')('o/ne'))
      t.notOk(wcmatch('o*n*e', '/')('on/e'))
      t.notOk(wcmatch('o*n*e', '/')('o/n/e'))
      t.notOk(wcmatch('o*n*e', '/')(' one '))
      t.notOk(wcmatch('*ne/*o', '/')('/ne/o'))
    })
  })

  t.test('**', (t) => {
    t.test('No separator given - acts as *', (t) => {
      t.ok(wcmatch('**')(''))
      t.ok(wcmatch('**')('/'))
      t.ok(wcmatch('**')('one'))
      t.ok(wcmatch('one**')('one'))
      t.notOk(wcmatch('one**')('one/two'))
      t.notOk(wcmatch('one**')('on'))
      t.notOk(wcmatch('one**')('ont'))
      t.notOk(wcmatch('one**')('onte'))
    })

    t.test('Separator given - matches any number of segments', (t) => {
      t.ok(wcmatch('**', '/')(''))
      t.ok(wcmatch('**', '/')(' '))
      t.ok(wcmatch('**', '/')(' /'))
      t.ok(wcmatch('**', '/')('/'))
      t.ok(wcmatch('**', '/')('///'))
      t.ok(wcmatch('**', '/')('two'))
      t.ok(wcmatch('**', '/')('two/three'))
      t.ok(wcmatch('**', '/')('   /three'))
      t.ok(wcmatch('**', '/')('   /three///'))
      t.ok(wcmatch('**', '/')('/three'))
      t.ok(wcmatch('**', '/')('//three'))
      t.ok(wcmatch('one/**', '/')('one'))
      t.ok(wcmatch('one/**', '/')('one/two'))
      t.ok(wcmatch('one/**', '/')('one/two/three'))
      t.ok(wcmatch('one/**', '/')('one/'))
      t.ok(wcmatch('one/**', '/')('one/ / '))
      t.ok(wcmatch('one/**', '/')('one/*/ **'))
      t.ok(wcmatch('one/**', '/')('one/***'))
      t.ok(wcmatch('**/', '/')('/one/'))
      t.ok(wcmatch('**/one', '/')('/one'))
      t.ok(wcmatch('**/one', '/')('one/'))
      t.ok(wcmatch('one/**/two', '/')('one/two'))
      t.ok(wcmatch('one/**/three', '/')('one/two/three'))
      t.ok(wcmatch('one/**/four', '/')('one/two/three/four'))
      t.ok(wcmatch('o**', '/')('o'))
      t.ok(wcmatch('o**', '/')('one'))
      t.ok(wcmatch('o**', '/')('onetwo'))
      t.ok(wcmatch('**e', '/')('one'))
      t.ok(wcmatch('**e', '/')('twoone'))
      t.notOk(wcmatch('one/**', '/')(''))
      t.notOk(wcmatch('one/**', '/')('/'))
      t.notOk(wcmatch('one/**', '/')('//'))
      t.notOk(wcmatch('one/**', '/')('two'))
      t.notOk(wcmatch('one/**', '/')('/one'))
      t.notOk(wcmatch('**/one', '/')(''))
      t.notOk(wcmatch('**/one', '/')('/'))
      t.notOk(wcmatch('**/one', '/')('//'))
      t.notOk(wcmatch('**/one', '/')('two'))
      t.notOk(wcmatch('**two', '/')('one/two'))
      t.notOk(wcmatch('**two', '/')('one/two'))
      t.notOk(wcmatch('**/', '/')('/one'))
      t.notOk(wcmatch('**/', '/')('/one/two'))
      t.notOk(wcmatch('o**', '/')(''))
      t.notOk(wcmatch('o**', '/')('two'))
      t.notOk(wcmatch('o**', '/')('o/two'))
      t.notOk(wcmatch('o**', '/')('o/two/three'))
      t.notOk(wcmatch('**e', '/')(''))
      t.notOk(wcmatch('**e', '/')('two'))
      t.notOk(wcmatch('**e', '/')('two/one'))
      t.notOk(wcmatch('**e', '/')('three/two/one'))
    })
  })

  t.test('? and *', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('?*')('o'))
      t.ok(wcmatch('?*')('one'))
      t.notOk(wcmatch('?*')('one/two'))
      t.notOk(wcmatch('?ne*')('one/two'))
      t.notOk(wcmatch('?*')(''))
      t.notOk(wcmatch('one?*')('one'))
      t.notOk(wcmatch('?ne*')('ne/two'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('?*', '/')('one'))
      t.ok(wcmatch('?*', '/')('one/'))
      t.ok(wcmatch('?*/', '/')('one/'))
      t.ok(wcmatch('?*/*', '/')('one/'))
      t.ok(wcmatch('?*/*', '/')('one/two'))
      t.ok(wcmatch('?*/*', '/')('one/two/'))
      t.ok(wcmatch('?*?', '/')('oe'))
      t.ok(wcmatch('?*?', '/')('one'))
      t.ok(wcmatch('?*?', '/')('onnne'))
      t.ok(wcmatch('?*?/*', '/')('one/'))
      t.ok(wcmatch('?*?/*', '/')('one/two'))
      t.ok(wcmatch('?*?/*/*', '/')('one/two/three'))
      t.ok(wcmatch('?*?/*/*', '/')('one//'))
      t.notOk(wcmatch('?*', '/')(''))
      t.notOk(wcmatch('?*', '/')('/'))
      t.notOk(wcmatch('?*', '/')('/one'))
      t.notOk(wcmatch('?*/*', '/')('one'))
      t.notOk(wcmatch('?*/*', '/')('one/two/three'))
      t.notOk(wcmatch('?*?', '/')('o'))
      t.notOk(wcmatch('?*?', '/')('/one'))
      t.notOk(wcmatch('?*?', '/')('o/e'))
      t.notOk(wcmatch('?*?/*', '/')(''))
      t.notOk(wcmatch('?*?/*', '/')('one'))
      t.notOk(wcmatch('?*?/*', '/')('one/two/three'))
      t.notOk(wcmatch('?*?/*/*', '/')(''))
      t.notOk(wcmatch('?*?/*/*', '/')('one'))
      t.notOk(wcmatch('?*?/*/*', '/')('one/two'))
      t.notOk(wcmatch('?*?/*/*', '/')('one/two/three/four'))
      t.notOk(wcmatch('?*?/*/*', '/')('o/two/three'))
    })
  })

  t.test('* and **', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('*/**')('/'))
      t.ok(wcmatch('*/**')('one/two'))
      t.ok(wcmatch('**/*')('one/two'))
      t.ok(wcmatch('one**/*')('one/two'))
      t.ok(wcmatch('one*/**')('one/two'))
      t.ok(wcmatch('**one*/**')('one/two'))
      t.ok(wcmatch('**/*')('one'))
      t.ok(wcmatch('**/*')(''))
      t.notOk(wcmatch('one**/*')('one'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('*/**', '/')(''))
      t.ok(wcmatch('*/**', '/')(' '))
      t.ok(wcmatch('*/**', '/')(' /'))
      t.ok(wcmatch('*/**', '/')('/'))
      t.ok(wcmatch('*/**', '/')('///'))
      t.ok(wcmatch('*/**', '/')('two'))
      t.ok(wcmatch('*/**', '/')('two/three'))
      t.ok(wcmatch('*/**', '/')('   /three'))
      t.ok(wcmatch('*/**', '/')('   /three///'))
      t.ok(wcmatch('*/**', '/')('/three'))
      t.ok(wcmatch('*/**', '/')('//three'))
      t.ok(wcmatch('**/*', '/')('one'))
      t.ok(wcmatch('**/*', '/')('one/two'))
      t.ok(wcmatch('**/*', '/')('one/two/three'))
      t.ok(wcmatch('**/*', '/')('one/*/three'))
      t.ok(wcmatch('**/*', '/')('one/*/**'))
      t.ok(wcmatch('*/**/*', '/')('one/two'))
      t.ok(wcmatch('*/**/*', '/')('one/two/three'))
      t.ok(wcmatch('*/**/*', '/')('one/two/three/four/five'))
      t.ok(wcmatch('*/**/*', '/')('one/two/*/four/five'))
      t.ok(wcmatch('*/**/*', '/')('one/two/*/four/**'))
      t.ok(wcmatch('*/**/*', '/')('one/ /three'))
      t.ok(wcmatch('*/**/*/**', '/')('one/two'))
      t.ok(wcmatch('*/**/*/**', '/')('one/two/three'))
      t.ok(wcmatch('one/*/**', '/')('one/two'))
      t.ok(wcmatch('one/*/**', '/')('one/two/three'))
      t.ok(wcmatch('one/*/**', '/')('one/two/three/four'))
      t.ok(wcmatch('one/*/**', '/')('one/ / '))
      t.ok(wcmatch('one/*/**', '/')('one/*/ **'))
      t.ok(wcmatch('one/*/**', '/')('one/***'))
      t.ok(wcmatch('one/**/two/*', '/')('one/two/three'))
      t.ok(wcmatch('one/**/two/*', '/')('one/two/three'))
      t.ok(wcmatch('one/**/three/*', '/')('one/two/three/four'))
      t.ok(wcmatch('*e/**e', '/')('one/one'))
      t.ok(wcmatch('*e/**e', '/')('e/e'))
      t.notOk(wcmatch('*/**/*', '/')('one'))
      t.notOk(wcmatch('*/**/*/**', '/')('one'))
      t.notOk(wcmatch('one/*/**', '/')(''))
      t.notOk(wcmatch('one/*/**', '/')('/'))
      t.notOk(wcmatch('one/*/**', '/')('//'))
      t.notOk(wcmatch('one/*/**', '/')('one'))
      t.notOk(wcmatch('*/**/one', '/')(''))
      t.notOk(wcmatch('*/**/one', '/')('/'))
      t.notOk(wcmatch('*/**/one', '/')('//'))
      t.notOk(wcmatch('*/**/one', '/')('one'))
      t.notOk(wcmatch('*/**/one', '/')('one/two'))
      t.notOk(wcmatch('*/**/one', '/')('two/one/two'))
      t.notOk(wcmatch('*e/**e', '/')('one/two'))
      t.notOk(wcmatch('*e/**e', '/')('two/e'))
    })
  })

  t.test('? and **', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('?**')('o'))
      t.ok(wcmatch('?**')('one'))
      t.notOk(wcmatch('?**')('one/two'))
      t.notOk(wcmatch('?ne**')('one/two'))
      t.notOk(wcmatch('?**')(''))
      t.notOk(wcmatch('one?**')('one'))
      t.notOk(wcmatch('?ne**')('ne/two'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('**/?', '/')('o'))
      t.ok(wcmatch('**/?', '/')('one/t'))
      t.ok(wcmatch('**/?', '/')('one/two/three/f'))
      t.ok(wcmatch('???/**/???', '/')('one/two'))
      t.ok(wcmatch('???/**/???', '/')('one/three/two'))
      t.ok(wcmatch('???/**/???', '/')('one//two'))
      t.notOk(wcmatch('**/?', '/')(''))
      t.notOk(wcmatch('**/?', '/')('one'))
      t.notOk(wcmatch('???/**/???', '/')('one/two/three'))
      t.notOk(wcmatch('???/**/???', '/')('one'))
      t.notOk(wcmatch('???/**/???', '/')('onetwo'))
    })
  })

  t.test('?, * and **', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('?*/**')('one/two'))
      t.ok(wcmatch('?*/?**')('one/two'))
      t.ok(wcmatch('?*/**')('one'))
      t.notOk(wcmatch('?*/**')('/two'))
    })

    t.test('Separator === true', (t) => {
      t.ok(wcmatch('?*/**', true)('one/two'))
      t.ok(wcmatch('?*/?**', true)('one/two'))
      t.ok(wcmatch('?*/**', true)('one'))
      t.notOk(wcmatch('?*/**', true)('/two'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('?*?/**', '/')('oe'))
      t.ok(wcmatch('?*?/**', '/')('one'))
      t.ok(wcmatch('?*?/**', '/')('one/'))
      t.ok(wcmatch('?*?/**', '/')('one/two'))
      t.ok(wcmatch('?*?/**', '/')('one/two/three'))
      t.ok(wcmatch('?*?/**', '/')('one/two/three/four'))
      t.ok(wcmatch('*/**/?*', '/')('/o'))
      t.ok(wcmatch('*/**/?*', '/')('/one'))
      t.ok(wcmatch('*/**/?*', '/')('one/two'))
      t.ok(wcmatch('*/**/?*', '/')('one/two/three'))
      t.ok(wcmatch('*/**/?*', '/')('/two/three'))
      t.ok(wcmatch('*/**/?*', '/')('one/two/three/four'))
      t.notOk(wcmatch('?*?/**', '/')(''))
      t.notOk(wcmatch('?*?/**', '/')('/'))
      t.notOk(wcmatch('?*?/**', '/')('o'))
      t.notOk(wcmatch('?*?/**', '/')('o/two'))
      t.notOk(wcmatch('*/**/?*', '/')(''))
      t.notOk(wcmatch('*/**/?*', '/')('o'))
      t.notOk(wcmatch('*/**/?*', '/')('o/'))
    })
  })

  t.test('Supports different separators', (t) => {
    t.ok(wcmatch('', undefined)(''))
    t.ok(wcmatch('one', undefined)('one'))
    t.ok(wcmatch('o?e', undefined)('one'))
    t.ok(wcmatch('', '.')(''))
    t.ok(wcmatch('one', '.')('one'))
    t.ok(wcmatch('o?e', '.')('one'))
    t.ok(wcmatch('one.two', '.')('one.two'))
    t.ok(wcmatch('one.*', '.')('one.*'))
    t.ok(wcmatch('one.**.*\\?js', '.')('one.two.three?js'))
    t.ok(wcmatch('one ** *\\?js', ' ')('one two three?js'))
    t.ok(wcmatch('one.**.*.js', '.')('one.two.three.js'))
    t.notOk(wcmatch('one.two', '.')('one/two'))
    t.notOk(wcmatch('one?two', '.')('one.two'))
    t.notOk(wcmatch('one.*', '.')('one/*'))
  })

  t.test('Treats RegExp characters literally', (t) => {
    t.ok(wcmatch('[].')('[].'))
    t.ok(wcmatch('one[].*+{}]  ][[..$', '/')('one[].*+{}]  ][[..$'))
    t.notOk(wcmatch('[].')('[]?'))
    t.notOk(wcmatch('one', '/')('one[].*+{}]][[..$'))
    t.notOk(wcmatch('one[].*+{}]][[..$', '/')('one'))
    t.notOk(wcmatch('[].*+{}]][[..$', '/')('].*+{'))
  })

  t.test('Treats escaped wildcards literally', (t) => {
    t.test('No separator given', (t) => {
      t.ok(wcmatch('\\?')('?'))
      t.ok(wcmatch('one/\\*\\*')('one/**'))
      t.ok(wcmatch('on\\?.two\\*\\*')('on?.two**'))
      t.notOk(wcmatch('\\?')('a'))
      t.notOk(wcmatch('one/\\*\\*')('one/two'))
      t.notOk(wcmatch('on\\?.two\\*\\*')('one.two'))
    })

    t.test('Separator given', (t) => {
      t.ok(wcmatch('\\?', '/')('?'))
      t.ok(wcmatch('\\*', '/')('*'))
      t.ok(wcmatch('\\*\\*', '/')('**'))
      t.ok(wcmatch('\\?\\*', '/')('?*'))
      t.ok(wcmatch('\\?\\*\\*', '/')('?**'))
      t.ok(wcmatch('one\\?', '/')('one?'))
      t.ok(wcmatch('one\\*', '/')('one*'))
      t.ok(wcmatch('one\\*\\*', '/')('one**'))
      t.ok(wcmatch('one/\\*\\*', '/')('one/**'))
      t.notOk(wcmatch('\\?', '/')('!'))
      t.notOk(wcmatch('\\*', '/')('!'))
      t.notOk(wcmatch('\\*', '/')('!!'))
      t.notOk(wcmatch('\\*\\*', '/')('!!'))
      t.notOk(wcmatch('\\*\\*', '/')('one/two'))
      t.notOk(wcmatch('\\?\\*', '/')('one'))
      t.notOk(wcmatch('\\?\\*\\*', '/')('one'))
      t.notOk(wcmatch('one\\?', '/')('one!'))
      t.notOk(wcmatch('one\\*', '/')('one!'))
      t.notOk(wcmatch('one\\*\\*', '/')('one!!'))
      t.notOk(wcmatch('one/\\*\\*', '/')('one/!!'))
    })
  })

  t.test('Accepts an array of patterns', (t) => {
    t.ok(wcmatch(['one'])('one'))
    t.notOk(wcmatch(['one'])('two'))
    t.ok(wcmatch(['**', 'one'])('whatever'))
    t.ok(wcmatch(['one', 'two', 'three'])('one'))
    t.ok(wcmatch(['one', 'two', 'three'])('two'))
    t.ok(wcmatch(['one', 'two', 'three'])('three'))
    t.notOk(wcmatch(['one', 'two', 'three'])('four'))
    t.ok(wcmatch(['one', 'one/two'], '/')('one'))
    t.ok(wcmatch(['one', 'one/two'], '/')('one/two'))
    t.notOk(wcmatch(['one', 'one/two'], '/')('two'))
    t.notOk(wcmatch(['one', 'one/two'], '/')('onetwo'))
    t.ok(wcmatch(['*', '*/*'], '/')('one'))
    t.ok(wcmatch(['*', '*/*'], '/')('two'))
    t.ok(wcmatch(['*', '*/*'], '/')('one/two'))
    t.notOk(wcmatch(['*', '*/*'], '/')('one/two/three'))
  })
}
