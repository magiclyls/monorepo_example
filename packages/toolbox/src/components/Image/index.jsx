import { useState, useEffect, useRef } from 'react'
import { useInViewport } from 'ahooks'
export const Image = (props = {}) => {
  const imgRef = useRef(null);
  const [inViewport] = useInViewport(imgRef);
  const [isOk, setIsOk] = useState(false)
  const { src, remote = false, isGame = false, alt = '', 
  renderType = 'div',
  loading, className, ...ps } = props
  const path = remote ? '' : `/images`
  const url = `${cdn}${path}${src}`

  const imgUlr = src?.indexOf('xxxx') > -1 ? src : url
  useEffect(() => {
    if (loading && inViewport) {
      const imgDom = document.createElement('img')
      imgDom.onload = () => {
        setIsOk(true)
      }
      imgDom.src = imgUlr
    }
  }, [imgUlr, inViewport])
  return <>
     <div ref={imgRef} className={'!w-[0rem] !h-[0rem]'}></div>
    {
      loading && !isOk ? loading : (renderType === 'img' ? <img
        src={imgUlr}
        alt={alt} {...ps} className={`bg-no-repeat bg-size-[100% 100%] ${className}`} /> : <div
        style={{ backgroundImage: `url(${imgUlr})` }}
        alt={alt} {...ps} className={`bg-no-repeat bg-size-[100% 100%] ${className}`} >
          {
          ps.children
          }
        </div>)
    }
  </>
}
export default Image