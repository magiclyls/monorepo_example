

export const base64ToFile = (dataurl) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const suffix = mime.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const _blob = new Blob([u8arr], {type: mime})
  _blob.lastModifiedDate = new Date();
  const fileName = `${getUuid()}.${suffix}`
  _blob.name = fileName;
  return new File([_blob], fileName, {type: _blob.type, lastModified: Date.now()})
}
export const fileToBase64 = (file) => {
  return new Promise((reslove) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      reslove(reader.result)
    };
    reader.onerror = function (error) {
      reslove('')
    };
  })
}

export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 计算 base64 编码图片大小
function getBase64ImageSize(base64) {
  const indexBase64 = base64.indexOf("base64,");
  if (indexBase64 < 0) return -1;
  const str = base64.substr(indexBase64 + 6);
  // 大小单位：字节
  return (str.length * 0.75).toFixed(2);
}

/**
 * 	图像压缩，默认同比例压缩
 * @param {Object} imgPath
 *	图像 base64 编码字符串或图像可访问路径
 * @param {Object} compParamObj
 *	压缩参数，compParamObj 对象的属性：width-宽，height-高，
 *  ratio(0-1)-宽高压缩率，quality(0-1)-图像质量系数
 * @param {Object} maxSize
 *	指定压缩后的文件大小，单位：字节
 * @param {Object} callback
 *	回调函数有一个参数，base64 的字符串数据
 * @param {Object} left
 *	二分递归查找 left
 * @param {Object} right
 *	二分递归查找 right
 * @param {Object} oQuality
 *	初始图像质量系数
 */
function compressedImage( 
  imgPath,
  compParamObj,
  maxSize,
  callback,
  left = 0,
  right = null,
  oQuality = null
 ) {
  let img = new Image();
  img.src = imgPath;
  img.onload = function () {
    const _this = this;
    // 默认按比例压缩
    let w = _this.width * (compParamObj?.ratio || 1),
      h = _this.height * (compParamObj?.ratio || 1),
      scale = w / h;
    w = compParamObj.width || w;
    h = (compParamObj.height && compParamObj.height * (w / scale)) || h;
    // 生成 canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(_this, 0, 0, w, h);
    // 图像质量系数，默认图片质量为 0.8
    let quality = 0.8;
    if (
      compParamObj.quality &&
      compParamObj.quality > 0 &&
      compParamObj.quality <= 1
    ) {
      quality = compParamObj.quality;
    }
    // quality 值越小，所绘制出的图像越模糊
    let newBase64Image = canvas.toDataURL("image/jpeg", quality);
    let fileSize = getBase64ImageSize(newBase64Image);
 
    if (left <= right) {
      if (oQuality === null) {
        oQuality = quality;
      }
 
      const qualityArr = [],
        step = 0.01;
      for (let i = step; i <= oQuality; i += step) {
        qualityArr.push(parseFloat(i));
      }
 
      if (right === null) {
        right = qualityArr.length;
      }
 
      const mid = Math.floor((left + right) / 2);
 
      if (fileSize > maxSize) {
        compressedImage(
          imgPath,
          {
            quality: qualityArr[mid],
            // 设置宽高压缩率对图像进行宽高压缩，降低图像被压缩后出现彩虹斑的情况
            ratio: 0.5,
          },
          maxSize,
          callback,
          left,
          mid - 1,
          oQuality
        );
      } else {
        compressedImage(
          imgPath,
          {
            quality: qualityArr[mid],
            // 设置宽高压缩率对图像进行宽高压缩，降低图像被压缩后出现彩虹斑的情况
            ratio: 0.5,
          },
          maxSize,
          callback,
          mid + 1,
          right,
          oQuality
        );
      }
      return;
    }
    if (!!callback) {
      // 回调函数返回压缩后的 base64 图像
      callback(newBase64Image);
    }
  };
}

export const compressedImageByPromise = (imgPath) => {
  return new Promise((resolve) => {
    compressedImage(imgPath, imgPath, 1.3 * 1000 * 1024, (str) => {
      resolve(str)
    })
  })
}