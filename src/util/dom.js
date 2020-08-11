//操作dom
export function addEvent(el, type, fn) {
    el.addEventListener(type, fn, { passive: false, capture: false })
}
export function removeEvent(el, type, fn) {
    el.removeEventListener(type, fn, { passive: false, capture: false })
}

export function addTransition(el, time ,cub) {
    el.style.transition = `transform ${time}ms ${cub}`
}
export function clearTransition(el) {
    el.style.transition = 'none';
}

//判断磁吸的位置
export function magneTdirection(x,y){
    return x <= y / 2;
} 

//获取元素的位置
export function getRect(el) {
    return el.getBoundingClientRect()
}
//获取元素的父节点
export function getParentNode(el) {
    return el.parentNode;
}