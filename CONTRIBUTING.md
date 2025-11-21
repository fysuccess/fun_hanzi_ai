# 贡献指南

感谢你对字趣AI项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果发现bug或有功能建议，请：

1. 检查是否已有相关Issue
2. 如果没有，创建新的Issue
3. 提供详细的问题描述和复现步骤

### 提交代码

1. **Fork项目**
   ```bash
   git clone https://github.com/your-username/funhanzi.git
   cd funhanzi
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **开发功能**
   - 编写代码
   - 添加测试
   - 更新文档

5. **运行测试**
   ```bash
   npm test
   npm run lint
   ```

6. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   git push origin feature/your-feature-name
   ```

7. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写PR描述
   - 等待代码审查

## 代码规范

### TypeScript

- 使用TypeScript严格模式
- 为所有函数和变量添加类型注解
- 避免使用 `any` 类型

### React组件

- 使用函数式组件和Hooks
- 组件名使用PascalCase
- Props使用TypeScript接口定义

### 代码风格

- 使用2个空格缩进
- 使用单引号（字符串）
- 行尾不使用分号（遵循项目配置）
- 函数和变量使用camelCase
- 常量使用UPPER_SNAKE_CASE

### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat: 添加历史记录功能
fix: 修复笔顺动画在移动端的显示问题
docs: 更新README中的部署说明
```

## 开发环境设置

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/funhanzi.git
   cd funhanzi
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env.local` 文件，参考 [ENV_SETUP.md](./ENV_SETUP.md)

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **运行测试**
   ```bash
   npm test
   ```

## 项目结构

```
funhanzi/
├── app/              # Next.js应用目录
├── components/       # React组件
├── lib/             # 工具函数和API
├── __tests__/       # 测试文件
└── docs/            # 文档（如需要）
```

## 测试要求

- 新功能必须包含测试用例
- 测试覆盖率不应低于80%
- 所有测试必须通过

## 文档要求

- 新功能需要更新相关文档
- 复杂功能需要添加代码注释
- API变更需要更新API文档

## 代码审查

所有PR都会经过代码审查，审查重点：

- 代码质量和规范
- 功能正确性
- 测试覆盖
- 性能影响
- 安全性

## 问题反馈

如有任何问题，请：

1. 查看现有文档
2. 搜索已有Issue
3. 创建新Issue描述问题

## 行为准则

- 尊重所有贡献者
- 接受建设性批评
- 专注于对项目最有利的事情
- 对其他社区成员表示同理心

感谢你的贡献！🎉

