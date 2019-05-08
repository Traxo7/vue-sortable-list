# vue-sortable-list
Directive which makes your Vue list draggable.
- Touch support
- Handle support  

Examples at codesandbox: https://codesandbox.io/s/1yplrk6kw7
##### Requirements
- Vue ^2.0

##### Installation

From npm:  
`npm i -S vue-sortable-list`


### Usage


Register the directive:  

```
import VDraggable from 'vue-sortable-list'
Vue.use(VDraggable)
```

Use `v-draggable` attribute on any list element (e.g. `<ul v-draggable="{value: items}">`), 
and have `value` reference to your items list in your `data` object.


### Examples

##### Script
```
data: () => ({
  items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']
})
```
##### HTML
Without handle:  

```
<ul v-draggable="{value: items}">
  <li v-for="item in items" :key="item">{{ item }}</li>
</ul>
```

With handle:  
```
<ul v-draggable="{value: items, handle: 'handle'}">
  <li v-for="item in items" :key="item">
    <span class="handle">||</span>
    {{ item }}
  </li>
</ul>
```

### API

`v-draggable={value: items, handle: 'handle', placeholderClass: 'placeholder'}`  

##### Props  
- `{Array} value` - array of list items
- `{String} handle` - class used by handle element
- `{String} [placeholderClass = 'v-draggable__placeholder']` - class used by placeholder element

##### Events  
`start` - on drag start  
`end` - on drag end  
`change` - list updated - { from, to }
