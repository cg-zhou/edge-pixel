/**
 * 高斯模糊算法
 * 使用分离的高斯卷积实现，性能更优
 */

/**
 * 生成高斯核
 */
function generateGaussianKernel(radius: number): number[] {
  const kernel: number[] = []
  const sigma = radius / 2
  let sum = 0

  for (let i = -radius; i <= radius; i++) {
    const value = Math.exp(-(i * i) / (2 * sigma * sigma))
    kernel.push(value)
    sum += value
  }

  // 归一化
  return kernel.map(v => v / sum)
}

/**
 * 应用高斯模糊到图像数据
 * @param imageData - Canvas 图像数据
 * @param radius - 模糊半径（1-20）
 */
export const applyBlur = (imageData: ImageData, radius: number): void => {
  if (radius <= 0) return

  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const radius_int = Math.round(radius)
  const kernel = generateGaussianKernel(radius_int)

  // 创建临时数据用于水平模糊
  const tempData = new Uint8ClampedArray(data.length)

  // 水平模糊
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4
      let r = 0, g = 0, b = 0, a = 0

      for (let i = -radius_int; i <= radius_int; i++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + i))
        const sampleIndex = (y * width + sampleX) * 4
        const kernelValue = kernel[i + radius_int]!

        r += (data[sampleIndex] ?? 0) * kernelValue
        g += (data[sampleIndex + 1] ?? 0) * kernelValue
        b += (data[sampleIndex + 2] ?? 0) * kernelValue
        a += (data[sampleIndex + 3] ?? 0) * kernelValue
      }

      tempData[pixelIndex] = r
      tempData[pixelIndex + 1] = g
      tempData[pixelIndex + 2] = b
      tempData[pixelIndex + 3] = a
    }
  }

  // 垂直模糊
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4
      let r = 0, g = 0, b = 0, a = 0

      for (let i = -radius_int; i <= radius_int; i++) {
        const sampleY = Math.max(0, Math.min(height - 1, y + i))
        const sampleIndex = (sampleY * width + x) * 4
        const kernelValue = kernel[i + radius_int]!

        r += (tempData[sampleIndex] ?? 0) * kernelValue
        g += (tempData[sampleIndex + 1] ?? 0) * kernelValue
        b += (tempData[sampleIndex + 2] ?? 0) * kernelValue
        a += (tempData[sampleIndex + 3] ?? 0) * kernelValue
      }

      data[pixelIndex] = Math.round(r)
      data[pixelIndex + 1] = Math.round(g)
      data[pixelIndex + 2] = Math.round(b)
      data[pixelIndex + 3] = Math.round(a)
    }
  }
}
