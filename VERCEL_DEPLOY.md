# Vercel部署详细指南

## 重要提示

⚠️ **`.env.local` 文件不会在Vercel生产环境中使用！**

Vercel部署时，环境变量必须在Vercel平台配置，不能使用本地的 `.env.local` 文件。

## 部署步骤

### 1. 准备代码仓库

确保代码已推送到GitHub/GitLab/Bitbucket：

```bash
git add .
git commit -m "准备部署到Vercel"
git push origin main
```

### 2. 在Vercel中创建项目

1. 访问 [Vercel](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 **Add New Project**（添加新项目）
4. 导入你的Git仓库
5. 配置项目：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）

### 3. 配置环境变量（关键步骤！）

在部署之前或之后，必须配置环境变量：

1. **进入项目设置**
   - 在项目页面，点击顶部的 **Settings**
   - 在左侧菜单找到 **Environment Variables**

2. **添加环境变量**
   
   点击 **Add New**，逐个添加以下变量：

   ```
   MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi
   MONGODB_DB_NAME=hanzi
   REDIS_HOST=172.30.151.83
   REDIS_PORT=6379
   REDIS_PASSWORD=redis_YT4h4n
   DEEPSEEK_API_KEY=你的DeepSeek API密钥
   ```

   **配置选项**：
   - **Key**: 变量名（如 `MONGODB_URI`）
   - **Value**: 变量值（你的实际配置）
   - **Environment**: 选择适用的环境
     - ✅ Production（生产环境）
     - ✅ Preview（预览环境）
     - ⚠️ Development（开发环境，可选）

3. **保存环境变量**
   - 每个变量添加后点击 **Save**
   - 所有变量添加完成后，返回项目页面

### 4. 部署项目

#### 方式一：自动部署（推荐）
- 如果已连接Git仓库，推送代码后Vercel会自动部署
- 在 **Deployments** 页面可以看到部署状态

#### 方式二：手动部署
1. 在项目页面点击 **Deployments**
2. 找到最新的部署记录
3. 点击右侧的 **...** 菜单
4. 选择 **Redeploy**（重新部署）

### 5. 验证部署

1. **检查部署日志**
   - 在部署详情页面查看构建日志
   - 确认没有环境变量相关的错误

2. **测试应用**
   - 访问Vercel提供的域名（如 `your-project.vercel.app`）
   - 测试汉字搜索功能
   - 检查笔顺动画是否正常
   - 验证AI内容生成是否工作

## 环境变量配置清单

确保以下变量都已配置：

- [ ] `MONGODB_URI` - MongoDB连接字符串
- [ ] `MONGODB_DB_NAME` - 数据库名称（可选，默认hanzi）
- [ ] `REDIS_HOST` - Redis主机地址（可选）
- [ ] `REDIS_PORT` - Redis端口（可选）
- [ ] `REDIS_PASSWORD` - Redis密码（可选）
- [ ] `DEEPSEEK_API_KEY` - DeepSeek API密钥（必需）
- [ ] `OPENAI_API_KEY` - OpenAI API密钥（可选，如果使用OpenAI）

## 常见问题

### Q: 为什么部署后提示找不到环境变量？

**A**: 检查：
1. 环境变量是否在Vercel平台正确配置
2. 是否选择了正确的环境（Production/Preview）
3. 是否重新部署了应用（环境变量修改后需要重新部署）

### Q: 如何更新环境变量？

**A**:
1. 在Vercel项目设置中修改环境变量
2. 保存后，重新部署应用（Redeploy）

### Q: 本地开发和生产环境使用不同的配置？

**A**: 
- 本地开发：使用 `.env.local` 文件
- 生产环境：使用Vercel平台配置的环境变量
- 两者互不影响

### Q: 如何查看当前配置的环境变量？

**A**:
1. 在Vercel项目设置 → Environment Variables
2. 可以看到所有已配置的变量（值会被隐藏，只显示前几个字符）

## 安全提示

- ✅ 环境变量在Vercel中是加密存储的
- ✅ 不要在代码中硬编码敏感信息
- ✅ 不要将 `.env.local` 提交到Git仓库
- ✅ 定期更新API密钥

## 下一步

部署成功后：
1. 配置自定义域名（可选）
2. 设置自动部署（已默认启用）
3. 配置监控和日志
4. 测试所有功能

---

**需要帮助？** 查看 [Vercel官方文档](https://vercel.com/docs) 或提交Issue。

