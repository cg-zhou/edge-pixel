# Edge Pixel

[English Documentation](README.en.md) | 中文文档

[![GitHub license](https://img.shields.io/github/license/cg-zhou/edge-pixel.svg)](https://github.com/cg-zhou/edge-pixel/blob/main/LICENSE)

一个基于 ESA 边缘计算的图像编辑工具

**在线访问**: [https://pixel.cg-zhou.top](https://pixel.cg-zhou.top)

## 功能特性

### 性能与加速
- **极速加载** - 部署于[阿里云ESA](https://cn.aliyun.com/product/esa)，全球 CDN 加速，提供更快的加载速度
- **高效处理** - 实时预览处理，流畅的用户体验

### 图像编辑
- **实时调整** - 支持多维度参数实时预览
- **色彩调整** - 色相、饱和度、反色、灰阶
- **亮度与对比** - 亮度、对比度、高光、阴影、光感
- **效果处理** - 模糊、颗粒、褪色、暗角

### 图像变换
- **缩放** - 10% ~ 200% 范围内灵活缩放，实时显示像素尺寸
- **旋转** - 支持 -180° ~ 180° 旋转范围，快速按钮支持 90° 旋转
- **翻转** - 支持水平和垂直翻转

### 导出功能
- **多格式支持** - PNG（无损）、JPG（通用压缩）、WebP（最优压缩）

## 快速开始

### 安装
```bash
git clone https://github.com/cgzhou/edge-pixel.git
cd edge-pixel
yarn install
```

### 本地开发
```bash
yarn dev
```

### 生产构建
```bash
yarn build
```

## 部署

<div align="center">
  <img src="./esa.png" alt="ESA" />
</div>

本项目由[阿里云ESA](https://cn.aliyun.com/product/esa)提供加速、计算和保护。

- 全球CDN加速
- 边缘计算优化
- 安全防护
- 高可用部署

## License

- [MIT 许可证](LICENSE)
