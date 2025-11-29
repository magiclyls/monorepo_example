import { copy as copyVal } from 'clipboard'

export function copy(val) {
  copyVal(val)
}

export function openNotices(info) {
  const dom = document.createElement('div')
  dom.id = 'user-notices'
  dom.innerHTML = info
  dom.style.cssText = `
    position: fixed;
    top: 40px;
    left: 100px;
    transform: translate(-50%, -50%);
    padding: 10px 20px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 14px;
    z-index: 9999;
  `
  document.body.appendChild(dom)

  setTimeout(() => {
    document.body.removeChild(dom)
  }, 2000)
}
