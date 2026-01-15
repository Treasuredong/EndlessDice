# GitHub 项目上传指南

## 一、创建 GitHub 仓库

1. 登录 GitHub（https://github.com）
2. 点击右上角的 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**: 为项目命名（建议使用英文）
   - **Description**: 项目描述（可选）
   - **Visibility**: 选择仓库可见性（Public 或 Private）
   - 不要勾选 `Add a README file`、`Add .gitignore` 和 `Choose a license`
4. 点击 `Create repository`

## 二、初始化本地 Git 仓库

打开终端，进入项目根目录：

```bash
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
cd /Users/xuzhendong/Desktop/M/test
```

初始化 Git 仓库：

```bash
git init
```

## 三、创建 .gitignore 文件

为了避免上传不必要的文件，创建一个 `.gitignore` 文件：

```bash
touch .gitignore
```

将以下内容添加到 `.gitignore` 文件中：

```
# Dependencies
node_modules/

# Build outputs
dist/
build/
*.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.idea/
.vscode/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
```

## 四、提交代码到本地仓库

添加所有文件到 Git：

```bash
git add .
```

提交初始版本：

```bash
git commit -m "Initial commit"
```

## 五、连接到 GitHub 仓库

复制 GitHub 仓库的 HTTPS 或 SSH URL（在 GitHub 仓库页面的 `Code` 按钮下）

添加远程仓库：

```bash
git remote add origin <你的仓库URL>
# 例如：git remote add origin https://github.com/yourusername/your-repo-name.git
```

## 六、推送代码到 GitHub

推送主分支到远程仓库：

```bash
git push -u origin master
# 或如果默认分支是 main
git push -u origin main
```

系统会提示输入 GitHub 用户名和密码或 SSH 密钥（如果使用 SSH URL）。

## 七、验证上传

刷新 GitHub 仓库页面，检查代码是否成功上传。

## 八、后续更新

每次修改代码后，使用以下命令提交和推送更新：

```bash
git add .
git commit -m "描述你的修改"
git push
```

## 注意事项

1. 如果遇到权限问题，确保你的 GitHub 账户有仓库的写入权限
2. 如果使用 HTTPS URL，可能需要生成和使用个人访问令牌（PAT）来代替密码
3. 如果使用 SSH URL，确保你的 SSH 密钥已经添加到 GitHub 账户

如需进一步帮助，请参考 GitHub 官方文档：https://docs.github.com/zh/get-started/importing-your-projects-to-github/importing-source-code-to-github