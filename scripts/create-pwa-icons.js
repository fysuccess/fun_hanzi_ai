// 创建PWA图标的脚本
// 需要先安装 sharp: npm install sharp --save-dev

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [192, 512]
const inputIcon = path.join(__dirname, '../public/icon.png') // 需要准备一个1024x1024的图标
const outputDir = path.join(__dirname, '../public')

// 检查输入文件是否存在
if (!fs.existsSync(inputIcon)) {
  console.log('⚠️  未找到 icon.png 文件')
  console.log('请创建一个 1024x1024 的PNG图标文件放在 public/icon.png')
  console.log('然后运行: node scripts/create-pwa-icons.js')
  process.exit(1)
}

async function createIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`)
    await sharp(inputIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath)
    console.log(`✅ 创建图标: icon-${size}.png`)
  }
  console.log('✅ 所有图标创建完成！')
}

createIcons().catch(console.error)

