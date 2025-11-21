# 字趣 AI (FunHanzi AI)

智能化、可视化的汉字学习Web应用，支持笔顺动画、AI趣味讲解、描红练习等功能。

## 功能特性

### 核心功能 (P0)

- ✅ **汉字搜索**：支持输入单个汉字，自动解析词组中的第一个字
- ✅ **笔顺动画**：使用田字格背景，显示标准笔顺动画
- ✅ **动画控制**：支持重播、暂停、调整播放速度
- ✅ **拼音显示**：显示标准拼音（含声调）
- ✅ **语音朗读**：点击喇叭图标播放汉字标准发音（浏览器TTS）
- ✅ **AI趣味讲解**：AI生成字源故事和巧记口诀
- ✅ **组词造句**：显示常用词汇和生活化例句
- ✅ **描红练习**：用户可在田字格上跟随引导线写字，系统判定对错

### 扩展功能 (P1)

- 🔄 **历史记录**：记录用户查询过的字（待实现）
- 🔄 **多字模式**：词语连播功能（待实现）
- 🔄 **AI绘图**：根据汉字含义生成插图（待实现）

## 技术栈

- **前端框架**：Next.js 14 (React 18)
- **UI样式**：Tailwind CSS
- **笔画引擎**：Hanzi Writer
- **拼音库**：pinyin-pro
- **后端框架**：Next.js API Routes
- **数据库**：MongoDB
- **AI服务**：OpenAI GPT-4o-mini / DeepSeek

## 快速开始

### 环境要求

- Node.js 18+ 
- MongoDB数据库（本地或MongoDB Atlas）
- OpenAI API Key 或 DeepSeek API Key

### 安装步骤

1. **克隆项目并安装依赖**

```bash
npm install
```

2. **配置环境变量**

创建 `.env.local` 文件：

```env
# MongoDB连接字符串（已配置的服务器）
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin

# MongoDB数据库名称
MONGODB_DB_NAME=hanzi

# Redis配置（可选）
REDIS_HOST=172.30.151.83
REDIS_PORT=6379
REDIS_PASSWORD=redis_YT4h4n

# DeepSeek API Key (推荐，更便宜)
DEEPSEEK_API_KEY=sk-...

# 或者使用 OpenAI API Key
# OPENAI_API_KEY=sk-...
```

**注意**: MongoDB和Redis服务器已配置好，你只需要添加AI API密钥即可。详细配置说明请参考 [ENV_SETUP.md](./ENV_SETUP.md)

3. **运行开发服务器**

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
funhanzi/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── character/     # 汉字查询API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── SearchBar.tsx      # 搜索栏
│   ├── HanziCharacter.tsx # 笔画动画组件
│   └── CharacterInfo.tsx  # 汉字信息展示
├── lib/                   # 工具函数
│   ├── api.ts            # API客户端
│   ├── db.ts             # MongoDB连接
│   ├── ai.ts             # AI服务集成
│   └── utils.ts          # 通用工具
├── __tests__/            # 测试文件
└── package.json
```

## API接口

### GET /api/character

查询汉字信息

**参数：**
- `char` (string, required): 要查询的汉字

**响应：**
```json
{
  "char": "猫",
  "pinyin": "māo",
  "radicals": "犭",
  "stroke_count": 11,
  "ai_content": {
    "story": "左边是'犭'代表动物，右边是'苗'，因为猫叫声像'苗'。",
    "mnemonic": "反犬旁，苗字边，捉老鼠，它是仙。",
    "words": ["小猫", "熊猫", "花猫"],
    "sentence": "我家的小猫喜欢在窗台上晒太阳。",
    "sentence_pinyin": "wǒ jiā de xiǎo māo xǐ huan zài chuāng tái shàng shài tài yáng."
  },
  "visit_count": 1
}
```

## 测试

运行测试：

```bash
npm test
```

运行测试（监听模式）：

```bash
npm run test:watch
```

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量：
   - `MONGODB_URI`
   - `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`
4. 部署完成

### 其他平台

项目支持部署到任何支持Next.js的平台：
- Netlify
- Railway
- 自建服务器（需要Node.js环境）

## 性能优化

- ✅ **缓存机制**：相同汉字第二次查询直接从数据库读取，不调用AI API
- ✅ **防抖处理**：搜索框输入500ms后才触发请求
- ✅ **响应式设计**：适配移动端和PC端
- ✅ **代码分割**：Next.js自动代码分割和懒加载

## 浏览器兼容性

- Chrome/Edge (推荐)
- Firefox
- Safari
- 移动端浏览器（iOS Safari, Chrome Mobile）

**注意**：语音朗读功能需要浏览器支持 `speechSynthesis` API。

## 开发计划

- [ ] 实现历史记录功能
- [ ] 实现多字模式（词语连播）
- [ ] 集成AI绘图功能
- [ ] 添加用户账户系统
- [ ] 实现学习进度跟踪
- [ ] 添加更多互动游戏

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue。

