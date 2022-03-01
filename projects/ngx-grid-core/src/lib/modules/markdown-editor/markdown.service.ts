import { Injectable } from '@angular/core'
import { baseKeymap, chainCommands, lift, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { DOMParser, DOMSerializer, Fragment, Mark, Schema, Slice } from 'prosemirror-model'
import { addListNodes, liftListItem, wrapInList } from 'prosemirror-schema-list'
import { EditorState, Plugin, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { BehaviorSubject } from 'rxjs'

import { BuildInputRules } from './prose-input-rules'
import { BuildKeymap } from './prose-keymap'
import { schema } from './prose-schema'

const customSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

const liftNested = chainCommands(liftListItem(customSchema.nodes['list_item']), lift);

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  public value = new BehaviorSubject<string>('')

  public activeActions  = new BehaviorSubject<Set<string>>(new Set())
  public enabledActions = new BehaviorSubject<Set<string>>(new Set())
  
  private _tmpAction?: IMarkdownEditorAction
  private _selectedLinkPositions: {start: number, end: number}[] = []
  private _selectedLinkMark?: Mark<any>

  public readonly actions: IMarkdownEditorAction[] = [
    {
      name: 'Bold',
      command: toggleMark(customSchema.marks['strong']),
      isMark: true,
      proseName: 'strong'
    },
    {
      name: 'Italic',
      command: toggleMark(customSchema.marks['em']),
      isMark: true,
      proseName: 'em',
    },
    {
      name: 'Strike',
      command: toggleMark(customSchema.marks['strike']),
      isMark: true,
      proseName: 'strike',
    },
    {
      name: 'Underline',
      command: toggleMark(customSchema.marks['underline']),
      isMark: true,
      proseName: 'underline',
    },
    {
      name: 'Heading1',
      command: (_, dispatch?) => {
        const isActive = this.activeActions.value.has('heading1')
        if (isActive || this.activeActions.value.has('heading')) setBlockType(customSchema.nodes['paragraph']) (this._editor!.state, dispatch)
        if (!isActive) setBlockType(customSchema.nodes['heading'], {level: 1})(this._editor!.state, dispatch)
        return true
      },
      proseName: 'heading1',
    },
    {
      name: 'Heading2',
      command: (_, dispatch?) => {
        const isActive = this.activeActions.value.has('heading2')
        if (isActive || this.activeActions.value.has('heading')) setBlockType(customSchema.nodes['paragraph']) (this._editor!.state, dispatch)
        if (!isActive) setBlockType(customSchema.nodes['heading'], {level: 2})(this._editor!.state, dispatch)
        return true
      },
      proseName: 'heading2',
    },
    { 
      name: 'Blockquote',
      command: (state, dispatch?) => {
        const isActive = this.activeActions.value.has('blockquote')
        if (isActive) {
          lift(state, dispatch)
        } else {
          wrapIn(customSchema.nodes['blockquote'])(state, dispatch)
        }
        return true
      },
      proseName: 'blockquote',
    },
    {
      name: 'Code',
      command: toggleMark(customSchema.marks['code']),
      isMark: true,
      proseName: 'code',
    },
    {
      name: 'Link',
      command: (state, dispatch?, attrs?) => {
        
        if (!this._editor) return false

        const {tr, selection} = state
        let touched = false
        
        const {start, end }   = this._selectedLinkMark ?
          { start: this._selectedLinkPositions[0].start, end: this._selectedLinkPositions[this._selectedLinkPositions.length-1].end } : 
          { start: selection.$from.pos, end: selection.$to.pos }

        if (this._selectedLinkMark) {
          tr.removeMark(start, end, this._selectedLinkMark)
          touched = true
        }
        
        if (attrs?.['href']) {
          const mark = new Mark()
          mark.type  = customSchema.marks['link']
          mark.attrs = attrs
          tr.addMark(start, end, mark)
          touched = true
        }

        if (touched) tr.setSelection(new TextSelection(tr.doc.resolve(end)));

        (dispatch ?? this._editor.dispatch)(tr)

        return true
      },
      enabled: () => {
        return this.activeActions.value.has('link') || (this._editor?.state.selection.content().content.size || 0) > 0
      },
      isMark: true,
      proseName: 'link',
    },
    {
      name: 'OrderedList',
      command: (_, dispatch?) => {
        const isActive = this.activeActions.value.has('ordered_list')
        if (isActive || this.activeActions.value.has('list_item')) liftNested(this._editor!.state, dispatch)
        if (!isActive) wrapInList(customSchema.nodes['ordered_list'])(this._editor!.state, dispatch)
        return true
      },
      proseName: 'ordered_list',
    },
    { 
      name: 'BulletList',
      command: (_, dispatch?: ((tr: Transaction) => void)) => {
        const isActive = this.activeActions.value.has('bullet_list') 
        if (isActive || this.activeActions.value.has('list_item')) liftNested(this._editor!.state, dispatch)
        if (!isActive) wrapInList(customSchema.nodes['bullet_list'])(this._editor!.state, dispatch)
        return true
      },
      proseName: 'bullet_list',
    },
  ]

  public isActive  = (a: IMarkdownEditorAction) => this.activeActions.value.has(a.proseName)
  public isEnabled = (a: IMarkdownEditorAction) => this.enabledActions.value.has(a.proseName)

  private _editor?: EditorView

  constructor() {}

  private _getActiveActions(
    activeItems: Set<string> = new Set(),
    fragment: Fragment<any> = this._editor!.state.selection.content().content
  ): Set<string> {
    if (!this._editor) throw new Error(`No editor instance`)
    if (!fragment.size) {
      const {nodeBefore, nodeAfter, path} = this._editor.state.selection.$from as any  
      const marks = [...(nodeBefore?.marks || []), ...(nodeAfter?.marks || [])]
      marks.forEach(m => activeItems.add(m.type.name))
      path.forEach((p: any) => {
        if (typeof p === 'object' && typeof p.content !== 'undefined') {
          activeItems.add(p.type.name)
          if (p.type.name === 'heading') activeItems.add(`${p.type.name}${p.attrs.level}`)
        }
      })
    }
    fragment.forEach(f => {
      const blockType = f.type
      if (blockType.name === 'heading') activeItems.add(`${blockType.name}${f.attrs['level']}`)
      activeItems.add(blockType.name)
      f.content.forEach(inline => {
        if (f.content.size > 0) this._getActiveActions(activeItems, f.content)
        inline.marks.forEach(m => activeItems.add(m.type.name))
      })
    })
    if (this._tmpAction) {
      if (this.isActive(this._tmpAction)) activeItems.delete(this._tmpAction.proseName)
      else activeItems.add(this._tmpAction.proseName)
      this._tmpAction = undefined
    }
    return activeItems
  }

  private _getEnabledActions(
    enabledItems: Set<string> = new Set(),
  ): Set<string> {
    this.actions.forEach(a => {
      if (typeof a.enabled === 'undefined' || a.enabled()) enabledItems.add(a.proseName)
    })
    return enabledItems
  }

  public init(el: HTMLElement): void {
    this._editor = new EditorView(el, {
      state: this._createState()
    })
  }

  public run(action: IMarkdownEditorAction, attrs: { [key: string]: any }): void {
    if (!this._editor) throw new Error('Editor is not defined')
    this._editor.focus()
    if (action.isMark) this._tmpAction = action
    action.command(this._editor.state, this._editor.dispatch, attrs)
  }

  public updateValue(v: string): void {
    const node = this._htmlToNode(v)
    let   html = (node as HTMLElement).innerHTML
    if (this.value.value === html) return
    this.value.next(html)
    if (!this._editor) return
    const outerDiv = document.createElement('div')
    outerDiv.appendChild(node)
    const state = this._editor.state
    const tr = state.tr.replace(0, state.doc.content.size, new Slice(DOMParser.fromSchema(customSchema).parse(outerDiv).content, 0, 0))
    this._editor.dispatch(tr)
  }

  public selectLink(): string | undefined {
    this._selectedLinkMark = undefined
    if (!this._editor) return
    const nodeAtCursor = this._editor.state.doc.nodeAt(this._editor.state.selection.$from.pos) ||
      this._editor.state.selection.$anchor.nodeBefore ||
      this._editor.state.selection.$anchor.nodeAfter
    if (!nodeAtCursor) return
    this._selectedLinkMark = nodeAtCursor.marks.find(m => m.type.name === 'link')
    const mark = this._selectedLinkMark
    if (!mark) return
    
    this._selectedLinkPositions.length = 0

    this._editor.state.doc.descendants((node, pos) => {
      if (node.type === nodeAtCursor.type && node.marks.includes(mark)) {
        this._selectedLinkPositions.push({ start: pos, end: pos + node.nodeSize })
      }
    })

    const tr = this._editor.state.tr
    const selection = TextSelection.between(
      tr.doc.resolve(this._selectedLinkPositions[0].start),
      tr.doc.resolve(this._selectedLinkPositions[this._selectedLinkPositions.length-1].end)
    )
    
    tr.setSelection(selection)
    this._editor.dispatch(tr)
    this._editor.focus()

    return mark.attrs['href']
    
  }
  
  public focus(): void {
    if (!this._editor) return
    const node = this._editor.state.doc.lastChild
    if (node) {
      const tr = this._editor.state.tr
      const positions: number[] = []
      tr.doc.descendants((node, pos) => { positions.push(pos + node.nodeSize) })
      tr.setSelection(new TextSelection(tr.doc.resolve(Math.max(...positions))));
      this._editor.dispatch(tr)
    }
    this._editor.focus()
  }

  public get hasFocus(): boolean {
    return this._editor?.hasFocus() === true
  }

  private _createState(content = this.value.value) {
    const service  = this
    const node     = this._htmlToNode(content)
    service.enabledActions.next(service._getEnabledActions())
    return EditorState.create({
      schema: customSchema,
      doc: DOMParser.fromSchema(customSchema).parse(node),
      plugins: [
        BuildInputRules(customSchema),
        keymap(BuildKeymap(customSchema)),
        keymap(baseKeymap),
        new Plugin({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          view() {
            return {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              update() {
                const div = document.createElement('div')
                const fragment = DOMSerializer
                  .fromSchema(customSchema)
                  .serializeFragment(service._editor!.state.doc.content)
                div.appendChild(fragment)
                service.value.next(div.innerHTML)
                service.activeActions.next(service._getActiveActions())
                service.enabledActions.next(service._getEnabledActions())
              }
            }
          }
        })
      ]
    })
  }

  private _htmlToNode(html: string): Node {
    const div = document.createElement('div')
    div.innerHTML = `${html || '<div></div>'}`
    return div
  }

  public onDestroy(): void {
    this._editor?.destroy()
  }
}

export interface IMarkdownEditorAction {
  command: TCommandFn,
  name: string,
  isMark?: boolean,
  proseName: string,
  enabled?(): boolean
}

export type TCommandFn = (
  state: EditorState<Schema<any>>,
  dispatch?: ((tr: Transaction) => void),
  attrs?: { [key: string]: any }
) => boolean
