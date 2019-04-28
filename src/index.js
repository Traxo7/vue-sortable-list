let draggingElement = null // element being dragged
let draggingElementHandle = null // element's handle
let draggingElementIndex = null // index of element being dragged
let items // data items in list

let config // directive configuration
let $vnode = null // vue vm

const isBefore = (el1, el2) => {
    if (el2.parentNode === el1.parentNode) {
        for (let cur = el1.previousSibling; cur; cur = cur.previousSibling) {
            if (cur === el2) {
                return true
            }
        }
    }
    return false
}

const onDragStart = e => {
    $vnode.child.$emit('start', e)

    if (e.dataTransfer) { // `touchstart` event doesn't have `dataTransfer` property
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', null)
    }
    draggingElement = e.target
    draggingElementHandle = config.handleClass && draggingElement.querySelector(`.${config.handleClass}`)
    draggingElementIndex = Array.from(e.target.parentElement.children).indexOf(e.target)
    draggingElement.parentElement.classList.add('drag')
}

const onDragEnter = e => {
    let _el
    if (e.type === 'touchmove') {
        // prevent scrolling on touch drag
        e.stopPropagation()
        e.preventDefault()
        // need to get the element we are hovering over
        const touch = e.touches[0]
        _el = document.elementFromPoint(touch.clientX, touch.clientY)
    } else {
        _el = e.target
    }

    if (Array.from(draggingElement.parentElement.children).indexOf(_el) === -1) return

    draggingElement.classList.add(config.placeholderClass)
    if (isBefore(draggingElement, _el)) {
        e.target.parentNode.insertBefore(draggingElement, _el)
    } else {
        e.target.parentNode.insertBefore(draggingElement, _el.nextSibling)
    }
}

const onDragEnd = e => {
    $vnode.child.$emit('end', e)

    if (draggingElementHandle) {
        draggingElement.setAttribute('draggable', 'false')
    }
    draggingElement.classList.remove(config.placeholderClass)
    draggingElement.parentElement.classList.remove('drag')

    let from = draggingElementIndex
    let to = Array.from(draggingElement.parentElement.children).indexOf(draggingElement)
    items.splice(to, 0, items.splice(from, 1)[0]) // move within array
    setTimeout(() => {
        draggingElement = null
        draggingElementIndex = null
        draggingElementHandle = null
    }, 0)
}
const makeDraggable = element => {
    const handleElement = config.handleClass && element.querySelector(`.${config.handleClass}`)

    if (handleElement) { // handle makes item draggable
        handleElement.onmousedown = e => {
            element.setAttribute('draggable', 'true')
        }
        handleElement.ontouchstart = e => {
            element.parentElement.classList.add('drag')
            element.setAttribute('draggable', 'true')
        }
        handleElement.onmouseup = e => { // `dragstart` not triggered onClick, so need this to cover onClick event
            element.setAttribute('draggable', 'false')
        }
        handleElement.ontouchend = e => {
            element.parentElement.classList.remove('drag')

            element.setAttribute('draggable', 'false')
        }
        element.ondragend = e => {
            e.target.setAttribute('draggable', 'false')
        }
    } else {
        element.setAttribute('draggable', 'true')
    }

    element.ondragstart = onDragStart
    element.ondragenter = onDragEnter
    element.ondragend = onDragEnd
    // touch support
    element.ontouchstart = onDragStart
    element.ontouchmove = onDragEnter
    element.ontouchend = onDragEnd
}

export default {
    install (Vue) {
        Vue.directive('draggable', {
            inserted: (listElement, binding, vnode) => {
                $vnode = vnode
                try {
                    if (undefined === (binding.value && binding.value.value)) {
                        throw new Error('A binding `value` property is not set.')
                    }
                    if (!Array.isArray(binding.value.value)) {
                        throw new Error('`value` property value should be an array.')
                    }
                } catch (err) {
                    return console.error(err)
                }
                items = binding.value && binding.value.value
                config = {
                    handleClass: (binding.value && binding.value.handle) || '',
                    placeholderClass: (binding.value && binding.value.placeholderClass) || 'v-draggable__placeholder'
                }

                Array.from(listElement.children).forEach(item => makeDraggable(item))

                listElement.addEventListener('DOMNodeInserted', function (e) {
                    if (draggingElement) return // prevent onenter insert
                    makeDraggable(e.target)
                })
            }
        })
    }
}
