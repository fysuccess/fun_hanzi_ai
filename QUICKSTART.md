# 快速开始指南

本指南将帮助你在5分钟内启动字趣AI项目。

## 前置要求

- Node.js 18 或更高版本
- npm 或 yarn 包管理器
- MongoDB数据库（本地或MongoDB Atlas）
- AI API密钥（DeepSeek或OpenAI）

## 步骤1: 安装依赖

```bash
npm install
```

## 步骤2: 配置环境变量

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

# DeepSeek API Key (推荐)
DEEPSEEK_API_KEY=你的DeepSeek API密钥

# 或者使用 OpenAI API Key
# OPENAI_API_KEY=你的OpenAI API密钥
```

**注意**: MongoDB和Redis服务器已配置好，你只需要添加AI API密钥即可。

详细配置说明请参考 [ENV_SETUP.md](./ENV_SETUP.md)

## 步骤3: 启动开发服务器

```bash
npm run dev
```

## 步骤4: 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

## 步骤5: 测试功能

1. 在搜索框输入一个汉字，例如：`猫`
2. 等待几秒钟，查看笔顺动画和AI生成的内容
3. 尝试点击"描红练习"按钮进行手写练习
4. 点击喇叭图标听发音

## 常见问题

### Q: 提示MongoDB连接失败？

**A**: 检查：
- `.env.local` 文件是否存在
- `MONGODB_URI` 是否正确（格式：`mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin`）
- 网络是否能访问172.30.151.83:27017
- 防火墙是否开放了27017端口

### Q: AI内容生成失败？

**A**: 检查：
- API密钥是否正确配置
- API密钥是否有足够额度
- 网络连接是否正常

### Q: 笔顺动画不显示？

**A**: 检查：
- 浏览器控制台是否有错误
- 网络连接是否正常（Hanzi Writer需要从CDN加载数据）

### Q: 语音朗读不工作？

**A**: 检查：
- 浏览器是否支持 `speechSynthesis` API
- 浏览器音量是否开启
- 尝试使用Chrome或Edge浏览器

## 下一步

- 阅读 [README.md](./README.md) 了解完整功能
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习如何部署
- 阅读 [TEST_REPORT.md](./TEST_REPORT.md) 了解测试情况

## 需要帮助？

如果遇到问题，请：
1. 查看本文档的常见问题部分
2. 检查 [ENV_SETUP.md](./ENV_SETUP.md) 中的配置说明
3. 提交GitHub Issue

