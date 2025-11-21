# 部署指南

本文档详细说明如何将字趣AI应用部署到生产环境。

## 部署前准备

### 1. 环境变量配置

确保以下环境变量已正确配置：

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/funhanzi?retryWrites=true&w=majority
OPENAI_API_KEY=sk-...  # 或使用 DeepSeek
DEEPSEEK_API_KEY=sk-...
```

### 2. MongoDB数据库设置

#### 使用MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群（512MB免费额度）
3. 创建数据库用户
4. 配置网络访问（允许所有IP或指定IP）
5. 获取连接字符串，格式：
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/funhanzi?retryWrites=true&w=majority
   ```

#### 数据库索引

建议在MongoDB中为`char`字段创建唯一索引以提高查询性能：

```javascript
db.characters.createIndex({ char: 1 }, { unique: true })
```

## 部署方式

### 方式一：Vercel部署（推荐）

Vercel是Next.js的官方推荐平台，提供免费额度，自动CI/CD。

#### 步骤：

1. **准备代码仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **在Vercel中部署**
   - 访问 [Vercel](https://vercel.com)
   - 使用GitHub账号登录
   - 点击"New Project"
   - 导入你的GitHub仓库
   - 配置项目：
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **配置环境变量（重要！）**
   
   ⚠️ **注意**：`.env.local` 文件不会在Vercel生产环境中使用！
   
   必须在Vercel平台配置环境变量：
   - 登录Vercel，进入项目
   - 点击项目设置（Settings）
   - 找到"Environment Variables"（环境变量）
   - 添加以下变量：
     ```
     MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi
     MONGODB_DB_NAME=hanzi
     REDIS_HOST=172.30.151.83
     REDIS_PORT=6379
     REDIS_PASSWORD=redis_YT4h4n
     DEEPSEEK_API_KEY=你的DeepSeek API密钥
     ```
   - 选择环境：Production（生产）、Preview（预览）、Development（开发）
   - 点击"Save"保存
   - 点击"Redeploy"重新部署使环境变量生效

4. **部署完成**
   - Vercel会自动构建和部署
   - 部署完成后会提供生产URL
   - 每次推送到main分支会自动触发部署

#### Vercel优势：
- ✅ 免费额度充足
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动CI/CD
- ✅ 预览部署（PR自动部署预览环境）

### 方式二：Railway部署

Railway提供简单的部署流程和数据库服务。

#### 步骤：

1. 访问 [Railway](https://railway.app)
2. 使用GitHub登录
3. 点击"New Project" -> "Deploy from GitHub repo"
4. 选择你的仓库
5. 在项目设置中添加环境变量
6. Railway会自动检测Next.js并部署

### 方式三：自建服务器部署

#### 服务器要求：
- Node.js 18+
- PM2（进程管理，可选）
- Nginx（反向代理，可选）

#### 步骤：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm start
   ```
   或使用PM2：
   ```bash
   pm2 start npm --name "funhanzi" -- start
   ```

3. **配置Nginx（可选）**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **配置HTTPS（推荐）**
   使用Let's Encrypt免费SSL证书：
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 部署后检查清单

- [ ] 环境变量已正确配置
- [ ] MongoDB连接正常
- [ ] API接口可以正常访问
- [ ] 前端页面可以正常加载
- [ ] 笔顺动画可以正常播放
- [ ] AI内容生成正常
- [ ] 移动端访问正常
- [ ] HTTPS已配置（生产环境必需）

## 性能优化建议

### 1. 数据库优化

- 为`char`字段创建唯一索引
- 定期清理不常用的数据（可选）
- 监控数据库连接数

### 2. CDN配置

- 静态资源使用CDN加速
- 配置合适的缓存策略

### 3. 监控和日志

- 配置错误监控（如Sentry）
- 设置性能监控
- 定期查看日志

## 故障排查

### 问题1：MongoDB连接失败

**检查：**
- 环境变量`MONGODB_URI`是否正确
- MongoDB Atlas网络访问是否允许
- 数据库用户名密码是否正确

### 问题2：AI API调用失败

**检查：**
- API Key是否正确配置
- API额度是否充足
- 网络连接是否正常

### 问题3：构建失败

**检查：**
- Node.js版本是否符合要求（18+）
- 依赖是否正确安装
- 环境变量是否在构建时可用

## 维护建议

1. **定期更新依赖**
   ```bash
   npm update
   ```

2. **监控API使用量**
   - 定期检查OpenAI/DeepSeek API使用情况
   - 设置使用量告警

3. **数据库备份**
   - 定期备份MongoDB数据
   - 使用MongoDB Atlas的自动备份功能

4. **性能监控**
   - 监控API响应时间
   - 监控数据库查询性能
   - 监控前端加载速度

## 成本估算

### 免费方案（适合个人项目）

- **Vercel**: 免费（个人项目）
- **MongoDB Atlas**: 免费（512MB）
- **DeepSeek API**: 约$0.14/百万tokens（非常便宜）

### 小型项目（月访问量1万）

- **Vercel Pro**: $20/月（可选）
- **MongoDB Atlas**: 免费或$9/月
- **DeepSeek API**: 约$1-5/月（取决于使用量）

## 支持

如遇到部署问题，请：
1. 查看本文档的故障排查部分
2. 提交GitHub Issue
3. 查看项目日志和错误信息

