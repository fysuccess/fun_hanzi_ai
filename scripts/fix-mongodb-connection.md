# MongoDB连接修复指南

当前连接失败，请尝试以下连接字符串格式：

## 选项1：不带authSource（推荐先试这个）
```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi
```

## 选项2：authSource=admin
```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin
```

## 选项3：authSource=hanzi
```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=hanzi
```

## 选项4：指定认证机制
```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin&authMechanism=SCRAM-SHA-1
```

## 选项5：SCRAM-SHA-256
```env
MONGODB_URI=mongodb://hanzi:hanzi6789@172.30.151.83:27017/hanzi?authSource=admin&authMechanism=SCRAM-SHA-256
```

## 测试步骤

1. 修改 `.env.local` 文件中的 `MONGODB_URI`
2. 运行测试：`npm run test:db`
3. 如果失败，尝试下一个选项

## 重要提示

即使MongoDB连接失败，应用仍然可以运行：
- AI功能正常工作
- 只是不会保存到数据库（每次查询都会调用AI）
- 功能完全可用，只是没有缓存优化

