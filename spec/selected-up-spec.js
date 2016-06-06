
describe('selected-up', function () {

  var editor

  beforeEach(function () {
    waitsFor(function () {
      return atom.packages.activatePackage('selected-up')
    })

    waitsFor(function () {
      return atom.workspace.open('sample.js')
    })

    waits(1)
    runs(function () {
      editor = atom.workspace.getActiveTextEditor()
    })
  })

  it ('editor should be activated', function (done) {
    expect(editor).not.toBeUndefined()
  })

  // describe('select single line', function () {
  //   beforeEach(function () {
  //     console.log(editor.getLineCount())
  //     //editor.setSelectedBufferRange(new Range)
  //   })
  //   it ('should not highlight', function () {
  //   })
  // })
  //
  // describe('select multiple lines', function () {
  //
  // })

})
