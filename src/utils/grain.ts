/**
 * 颗粒效果配置
 */
interface GrainConfig {
  /**
   * 随机数种子
   * - 数字：使用固定种子，每次生成相同颗粒图案
   * - undefined（默认）：使用时间戳，每次生成不同颗粒
   */
  seed?: number
}

let globalGrainConfig: GrainConfig = {
  seed: undefined,
}

/**
 * 设置全局颗粒配置
 */
export const setGrainConfig = (config: Partial<GrainConfig>) => {
  globalGrainConfig = {
    ...globalGrainConfig,
    ...config,
  }
}

/**
 * 获取全局颗粒配置
 */
export const getGrainConfig = (): GrainConfig => {
  return { ...globalGrainConfig }
}

/**
 * 改进的2D伪随机数生成器
 * 基于 x, y 坐标和种子，产生更均匀的随机分布
 */
const seededRandom2D = (x: number, y: number, seed: number): number => {
  // 使用多个不同的常数组合，减少周期性
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453
  return n - Math.floor(n)
}

/**
 * 应用颗粒效果到图像数据
 * @param imageData - Canvas 图像数据
 * @param intensity - 颗粒强度 (0-100)
 * @param seed - 随机数种子（可选，使用配置中的种子）
 */
export const applyGrain = (
  imageData: ImageData,
  intensity: number,
  seed?: number
): void => {
  if (intensity <= 0) return

  const data = imageData.data
  const width = imageData.width
  const grainAmount = (intensity / 100) * 80

  // 使用传入的种子或配置中的种子，如果都没有则使用时间戳
  const finalSeed = seed ?? globalGrainConfig.seed ?? Date.now()

  for (let i = 0; i < data.length; i += 4) {
    // 计算像素的二维坐标
    const pixelIndex = i / 4
    const y = Math.floor(pixelIndex / width)
    const x = pixelIndex % width

    // 基于二维坐标和种子生成更均匀的伪随机数
    const random = seededRandom2D(x, y, finalSeed)
    const grain = (random - 0.5) * grainAmount

    data[i] = Math.max(0, Math.min(255, data[i] + grain)) // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain)) // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain)) // B
    // data[i + 3] 是 Alpha，不修改
  }
}
