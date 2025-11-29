import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'

class AvatarUpload {
  /** 最大600KB */
  maxSizeMB = 600 * 1024
  maxWidthOrHeight = 1024

  /**
   * HEIC → png
   */
  async convertHeic(file: File): Promise<File> {
    const blob = await heic2any({
      blob: file,
      toType: 'image/png',
      quality: 0.9,
    })

    return new File([blob as Blob], file.name.replace(/\.heic$/i, '.png'), {
      type: 'image/png',
      lastModified: Date.now(),
    })
  }

  /**
   * 任意格式 → PNG
   */
  convertToFormat(file: File, targetType: 'image/png'): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx!.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (!blob)
              return reject(new Error('图片格式转换失败'))
            const newFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, targetType === 'image/png' ? '.png' : '.jpg'),
              {
                type: targetType,
                lastModified: Date.now(),
              },
            )
            resolve(newFile)
          },
          targetType,
          0.92,
        )
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 格式规范化（HEIC / WebP / BMP → PNG）
   */
  async normalizeImageFile(file: File): Promise<File> {
    const type = file.type.toLowerCase()

    // HEIC 特殊处理
    if (type.includes('heic') || file.name.endsWith('.heic')) {
      return await this.convertHeic(file)
    }

    // 已是 PNG / JPG 直接返回
    if (type === 'image/jpg' || type === 'image/png') {
      return file
    }

    // 其他格式 → PNG（兼容性最好）
    return await this.convertToFormat(file, 'image/png')
  }

  /**
   * 压缩（返回 File）
   */
  async compressFile(file: File): Promise<File> {
    const blob = await imageCompression(file, {
      maxSizeMB: this.maxSizeMB,
      maxWidthOrHeight: this.maxWidthOrHeight,
      useWebWorker: true,
    })

    return new File([blob], file.name, {
      type: blob.type || file.type,
      lastModified: Date.now(),
    })
  }
}

export const avatarUpload = new AvatarUpload()
