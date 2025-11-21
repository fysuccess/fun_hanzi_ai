# 环境变量配置指南

## 必需的环境变量

在项目根目录创建 `.env.local` 文件，并配置以下环境变量：

### 1. MongoDB连接字符串

#### 方式一：使用标准连接字符串（推荐）

```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin
```

#### 方式二：使用MongoDB Atlas（云数据库）

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hanzi?retryWrites=true&w=majority
```

**当前配置信息**:
- **服务器**: 172.30.151.83:27017
- **用户名**: hanzi
- **密码**: hanzi6789
- **数据库**: hanzi
- **版本**: MongoDB 7.0.21

**连接字符串格式**:
```
mongodb://[用户名]:[密码]@[IP地址]:[端口]/[数据库名]?authSource=admin
```

**注意**: 如果使用标准MongoDB连接，请确保：
- 数据库服务器允许远程连接
- 防火墙已开放27017端口
- 用户名和密码正确

### 2. Redis配置（可选，用于缓存加速）

```env
REDIS_HOST=172.30.151.83
REDIS_PORT=6379
REDIS_PASSWORD=redis_YT4h4n
```

**当前配置信息**:
- **服务器**: 172.30.151.83:6379
- **密码**: redis_YT4h4n
- **版本**: Redis 8.0.3

**注意**: Redis为可选配置，如果不配置，系统将只使用MongoDB缓存。

### 3. AI API密钥（二选一）

#### 选项A: DeepSeek API（推荐，更便宜）

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取方式**:
1. 访问 [DeepSeek](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在API Keys页面创建新密钥
4. 复制密钥到环境变量

#### 选项B: OpenAI API

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取方式**:
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号并登录
3. 在API Keys页面创建新密钥
4. 复制密钥到环境变量

**注意**: 如果同时配置了两个API密钥，系统会优先使用DeepSeek。

## 完整示例

`.env.local` 文件示例：

```env
# MongoDB连接字符串（使用提供的服务器配置）
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin

# MongoDB数据库名称（可选，默认为hanzi）
MONGODB_DB_NAME=hanzi

# Redis配置（可选，用于缓存加速）
REDIS_HOST=172.30.151.83
REDIS_PORT=6379
REDIS_PASSWORD=redis_YT4h4n

# DeepSeek API Key (推荐)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 或者使用 OpenAI API Key
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 环境变量说明

| 变量名 | 必需 | 说明 | 默认值 |
|--------|------|------|--------|
| `MONGODB_URI` | ✅ | MongoDB数据库连接字符串 | 无 |
| `DEEPSEEK_API_KEY` | ⚠️ | DeepSeek API密钥（推荐） | 无 |
| `OPENAI_API_KEY` | ⚠️ | OpenAI API密钥（备选） | 无 |

**注意**: `DEEPSEEK_API_KEY` 和 `OPENAI_API_KEY` 至少需要配置一个。

## 验证配置

配置完成后，运行以下命令验证：

```bash
npm run dev
```

如果配置正确，应用应该能够：
1. 连接到MongoDB数据库
2. 调用AI API生成内容
3. 正常显示汉字信息

如果出现错误，请检查：
- 环境变量文件名是否为 `.env.local`（注意前面的点）
- 环境变量值是否正确（没有多余空格）
- MongoDB网络访问是否已配置
- API密钥是否有效且有足够额度

## 生产环境配置（Vercel部署）

⚠️ **重要提示**：`.env.local` 文件**不会**在Vercel生产环境中使用！

Vercel部署时，必须在平台配置环境变量：

### 步骤：

1. **登录Vercel并进入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 选择你的项目

2. **配置环境变量**
   - 点击项目名称进入项目页面
   - 点击顶部菜单的 **Settings**（设置）
   - 在左侧菜单找到 **Environment Variables**（环境变量）
   - 点击 **Add New**（添加新变量）

3. **添加所有必需的环境变量**
   
   逐个添加以下变量：
   
   | 变量名 | 值 | 环境 |
   |--------|-----|------|
   | `MONGODB_URI` | `mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi` | Production, Preview, Development |
   | `MONGODB_DB_NAME` | `hanzi` | Production, Preview, Development |
   | `REDIS_HOST` | `172.30.151.83` | Production, Preview, Development |
   | `REDIS_PORT` | `6379` | Production, Preview, Development |
   | `REDIS_PASSWORD` | `redis_YT4h4n` | Production, Preview, Development |
   | `DEEPSEEK_API_KEY` | `你的DeepSeek API密钥` | Production, Preview, Development |
   
   **注意**：
   - 每个变量添加时，选择适用的环境（Production/Preview/Development）
   - 可以全选三个环境，或根据需要选择

4. **保存并重新部署**
   - 添加完所有变量后，点击 **Save**（保存）
   - 返回项目页面，点击 **Deployments**（部署）
   - 找到最新的部署，点击右侧的 **...** 菜单
   - 选择 **Redeploy**（重新部署）
   - 或者推送新的代码到Git仓库，Vercel会自动部署

5. **验证环境变量**
   - 部署完成后，在部署日志中检查是否有环境变量相关的错误
   - 访问应用，测试功能是否正常

### 环境变量说明

- **Production**：生产环境（正式域名）
- **Preview**：预览环境（每次PR都会创建预览）
- **Development**：开发环境（通常不使用）

建议：至少配置 **Production** 和 **Preview** 环境。

### 重要提示

- ❌ **不要**将 `.env.local` 文件提交到Git仓库
- ✅ **必须**在Vercel平台配置环境变量
- ✅ `.env.local` 仅用于本地开发
- ✅ 生产环境使用Vercel平台配置的环境变量

