# 故障排查指南

## MongoDB连接问题

### 问题：Authentication failed（认证失败）

**可能原因和解决方案：**

1. **authSource参数不正确**
   - 尝试移除 `?authSource=admin`
   - 或尝试 `?authSource=hanzi`
   - 或尝试 `?authSource=admin&authMechanism=SCRAM-SHA-1`

2. **用户名或密码错误**
   - 确认用户名：`hanzi`
   - 确认密码：`hanzi6789`
   - 确认数据库：`hanzi`

3. **连接字符串格式**
   
   尝试以下格式：
   ```env
   # 格式1：不带authSource
   MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi
   
   # 格式2：authSource=admin
   MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin
   
   # 格式3：authSource=hanzi
   MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=hanzi
   
   # 格式4：指定认证机制
   MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin&authMechanism=SCRAM-SHA-1
   ```

4. **网络连接问题**
   - 确认能ping通 172.30.151.83
   - 确认端口27017已开放
   - 检查防火墙设置

5. **测试连接**
   ```bash
   npm run test:db
   ```

### 问题：Connection timeout（连接超时）

**解决方案：**
1. 检查网络连接
2. 确认MongoDB服务正在运行
3. 检查防火墙规则
4. 尝试增加超时时间

## 描红练习问题

### 问题：描红练习按钮点击无反应

**已修复：**
- 重新初始化hanzi-writer实例
- 正确进入quiz模式
- 添加错误处理

**如果仍有问题：**
1. 检查浏览器控制台错误
2. 确认hanzi-writer库已正确加载
3. 尝试刷新页面

## 获取汉字信息失败

### 问题：API返回错误

**可能原因：**
1. MongoDB连接失败（但系统会降级到仅使用AI，不保存数据库）
2. AI API密钥无效或额度不足
3. 网络问题

**解决方案：**
1. 即使MongoDB连接失败，系统仍可使用（仅不保存缓存）
2. 检查AI API密钥配置
3. 查看服务器日志获取详细错误信息

## 快速诊断

运行以下命令进行诊断：

```bash
# 测试MongoDB连接
npm run test:db

# 检查环境变量
cat .env.local

# 查看服务器日志
npm run dev
```

## 联系支持

如果问题仍未解决，请提供：
1. 错误信息完整内容
2. 浏览器控制台日志
3. 服务器日志
4. MongoDB连接测试结果

