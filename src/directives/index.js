export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    dom.onerror = function () {
      dom.src = options.value
    }
  }
}
