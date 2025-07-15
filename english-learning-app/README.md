# 英语学习助手

一个具有苹果风格设计的英语学习小程序，通过游戏化的方式帮助用户轻松学习英语单词。

## 功能特点

### 📝 多种单词输入方式

1. **文件上传** - 支持 .txt, .json, .csv 格式的文件
   - TXT格式示例：
     ```
     apple - 苹果 [ˈæpl]
     book - 书 [bʊk]
     ```
   - JSON格式示例：
     ```json
     [
       {
         "english": "apple",
         "chinese": "苹果",
         "pronunciation": "ˈæpl"
       }
     ]
     ```

2. **手动输入** - 逐个添加单词，支持输入中文释义和音标

3. **随机生成** - 根据难度级别（初级/中级/高级/混合）自动生成单词列表

### 🎮 两种学习模式

1. **单词消消乐**
   - 记忆配对游戏
   - 匹配英文单词和中文释义
   - 训练视觉记忆能力

2. **拼写练习**
   - 听发音写单词
   - 支持语音合成朗读
   - 提供拼写提示功能

### 🎨 设计特色

- 采用苹果风格的现代化UI设计
- 支持深色模式自动适配
- 流畅的动画效果
- 响应式布局，支持移动设备

## 安装和运行

1. 确保已安装 Node.js (版本 14 或更高)

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm start
   ```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. **选择单词来源**：
   - 点击相应的选项卡选择输入方式
   - 上传文件或手动输入单词，或选择随机生成

2. **开始学习**：
   - 选择学习模式（消消乐或拼写练习）
   - 按照游戏提示进行学习

3. **查看成绩**：
   - 完成游戏后会显示得分和正确率
   - 可以选择重新开始或返回主页

## 技术栈

- React 18 + TypeScript
- Framer Motion (动画效果)
- Lucide React (图标库)
- React Dropzone (文件上传)
- Web Speech API (语音合成)

## 文件结构

```
src/
├── components/          # React组件
│   ├── FileUpload.tsx  # 文件上传组件
│   ├── ManualInput.tsx # 手动输入组件
│   ├── RandomWords.tsx # 随机生成组件
│   ├── MatchGame.tsx   # 消消乐游戏
│   └── SpellGame.tsx   # 拼写练习游戏
├── data/
│   └── wordDatabase.ts # 单词数据库
├── utils/
│   └── fileParser.ts   # 文件解析工具
├── types.ts            # TypeScript类型定义
├── App.tsx             # 主应用组件
└── index.css           # 全局样式

```

## 构建部署

构建生产版本：
```bash
npm run build
```

构建完成后，`build` 文件夹中的内容可以部署到任何静态文件服务器。

## 许可证

MIT License
