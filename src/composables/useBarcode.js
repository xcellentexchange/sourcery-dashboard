import bwipjs from 'bwip-js'

export function useBarcode() {
  const generateBarcode = async ({ el, type, code, options }) => {
    if (el !== null) {
      options.height = options.height || 6
      options = {
        ...{
          bcid: type,
          text: code,
          scale: 10,
          includetext: true,
          textalign: 'center',
        },
        ...options,
      }

      try {
        //   const canvas = document.createElement('canvas')
        //   bwipjs.toCanvas(canvas, options)
        //   el.src = canvas.toDataURL('image/svg')
        const svg = bwipjs.toSVG(options)
        el.innerHTML = svg
      } catch (e) {
        console.log(e)
      }
    }
  }

  return {
    generateBarcode,
  }
}
