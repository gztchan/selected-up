'use babel'

import { Range } from 'atom'

export default {

  markers: {},

  activate(state) {
    atom.workspace.observeActivePaneItem((editor) => {
      if (editor && !this.markers[editor.id]) {
         this.markers[editor.id] = []
      }
    })

    atom.workspace.onWillDestroyPaneItem((editor) => {
      this.markers[editor.id] = null
    })

    atom.workspace.observeTextEditors((editor) => {
      this.toggle(editor)
    })
  },

  toggle (editor) {
    editor.onDidChangeSelectionRange((event) => {
      this.removeMarkers(editor)
      const newRange = event.newBufferRange
      const isCursorPostionChanged = newRange.start.column === newRange.end.column
      if (newRange.isSingleLine() && isCursorPostionChanged) {
        this.render([newRange], editor)
      } else {
        this.render(editor.getSelectedBufferRanges(), editor)
      }
    })
  },

  render (ranges, editor) {
    const count = editor.getLineCount()

    // mask entire file
    let marker = editor.markBufferRange(new Range([0, 0], [count - 1, 0]), {
      invalidate: 'never'
    })

    editor.decorateMarker(marker, {
      type: 'line',
      class: !ranges[0].isSingleLine() ? 'unselected' : 'selected'
    })
    this.markers[editor.id].push(marker)

    // highlight ranges
    const that = this
    ranges.forEach((range, index) => {
      that.highlightRange(count, range, editor)
    })
  },

  /**
   * Highlight all selected ranges
   */
  highlightRange (count, range, editor) {
    let marker
    marker = editor.markBufferRange(range, {
      invalidate: 'never'
    })
    editor.decorateMarker(marker, {
      type: 'line',
      class: 'selected'
    })
    this.markers[editor.id].push(marker)
  },

  /**
   * Remove all markers
   */
  removeMarkers (editor) {
    if (!this.markers[editor.id]) {
      return
    }
    this.markers[editor.id].forEach((marker) => {
      marker.destroy()
    })
    this.markers[editor.id].splice(0, this.markers.length)
  },

  deactivate() {
    this.markers = {}
  }

};
