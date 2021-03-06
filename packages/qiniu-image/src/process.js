import _ from 'lodash'
import { getOptionWithSafeBase64Encode } from './util'

// 说明见 https://developer.qiniu.com/dora/api/3683/img-directions-for-use

// 不知道取什么名字
function getFunStr(url, fun, options) {
  let funStr = fun

  const { mode, ...rest } = options

  // mode 可能不存在，mode 可能为 0，用 undefined
  if (mode !== undefined) {
    funStr += `/${encodeURIComponent(mode)}`
  }

  for (const key in rest) {
    if (options[key] === true) {
      // 案例 auto-orient or
      funStr += `/${key}`
    } else {
      funStr += `/${key}/${encodeURIComponent(options[key])}`
    }
  }

  if (url) {
    return `${url}?${funStr}`
  } else {
    return `${funStr}`
  }
}

// 应该在融合 cdn 开启，如果是，这里没有意义了
function imageSlim(url) {
  return getFunStr(url, 'imageslim', {})
}

function imageView2(url, options) {
  return getFunStr(url, 'imageView2', options)
}

function imageMogr2(url, options) {
  return getFunStr(url, 'imageMor2', options)
}

/*
  混合水印 
  http://7xlv47.com0.z0.glb.clouddn.com/baidi.png?
    watermark/3
    /image/aHR0cDovLzd4bHY0Ny5jb20wLnowLmdsYi5jbG91ZGRuLmNvbS94aWFvamkucG5n/gravity/North/dy/-10/dx/0
    /text/5ZCD6L-H54yr5bGx546L77yM5YW25LuW5qa06I6y55qG6Lev5Lq6/gravity/SouthWest/dx/10/dy/180/fontsize/500
    /text/5LuF6ZmQN-WkqSAgMjAxOS4wNC4wMS0yMDE5LjA0LjA3/gravity/SouthWest/dx/30/dy/130/fontsize/300
    /image/aHR0cDovLzd4bHY0Ny5jb20wLnowLmdsYi5jbG91ZGRuLmNvbS9xdWFuLnBuZw==/gravity/SouthWest/dx/80/dy/30
    /image/aHR0cDovLzd4bHY0Ny5jb20wLnowLmdsYi5jbG91ZGRuLmNvbS_kuoznu7TnoIEucG5n/gravity/SouthEast/dx/10/dy/30
    /text/5omr56CB6aKG5Y-W5LyY5oOg5Yi4/gravity/SouthEast/dx/50/dy/10/fontsize/300/fill/UmVk/fwef
*/
function mixedWatermark(url, configs) {
  const query = _.reduce(
    configs,
    (s, options) => {
      delete options.mode
      const opt = getOptionWithSafeBase64Encode(options)
      return s + getFunStr(null, '', opt)
    },
    ''
  )
  return `${url}?watermark/3${query}`
}

function watermark(url, options) {
  if (options instanceof Array) {
    return mixedWatermark(url, options)
  }

  const opt = getOptionWithSafeBase64Encode(options)
  return getFunStr(url, 'watermark', opt)
}

// arr [{fun: 'imageView2', options: {}}]
function pipeline(url, arr) {
  const funStr = arr
    .map(item => {
      const opt = getOptionWithSafeBase64Encode(item.options)
      return getFunStr(null, item.fun, opt)
    })
    .join('|')

  return `${url}?${funStr}`
}

export { imageSlim, imageView2, imageMogr2, watermark, pipeline }
