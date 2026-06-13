# 📖 单词筛查背诵器

一个轻量级的单词筛查背诵工具，支持四选一测试、错题本、滑动切换、多格式导出。

---

## 🚀 快速开始

### 安装 Python

先去 https://python.org 下载安装 Python，**安装时勾选 ✅ Add Python to PATH**。

### 下载并启动

打开 VS Code → 终端 → 新建终端，依次输入：

```powershell
git clone https://github.com/yinlan996996/dan-ci-qi.git
cd dan-ci-qi
pip install -r requirements.txt
python app.py
```

看到「启动成功」后，浏览器打开 `http://localhost:5000`。

## 💻 电脑版使用

### 导入单词

- **上传 CSV**：准备好 `english,chinese` 格式的 CSV 文件，点击上传
- **粘贴文本**：每行 `英文 中文`，点导入
- **手动添加**：填英文 + 中文，点添加

### 筛查测试

1. 选择「全部单词」或「仅错题」
2. 点开始筛查 → 看英文选中文释义（四选一）
3. 答对 ✅ 答错 ❌，自动滚到下一题按钮
4. 做完显示成绩，可选「再来一轮」

### 错题本

自动记录所有答错的单词，按错误次数排序。

### 导出

- **PDF**：点导出 PDF，下载带表格的 PDF 文件
- **Word**：点导出 Word，下载 .docx 表格文件

表格列：序号 | 英文 | 中文 | 掌握状态 | 错误次数

---

## 📱 iPhone 使用

### 在线版（需同一网络）

电脑启动 `python app.py` 后，iPhone Safari 打开：

```
http://<电脑IP>:5000
```

电脑 IP 查看方式：终端输入 `ipconfig`，找 IPv4 地址。

### 离线版

1. iPhone Safari 打开 `http://<电脑IP>:5000/offline`
2. 页面自动同步词汇到手机
3. 点底部分享 ⬆️ → **添加到主屏幕**
4. 之后桌面图标打开，保留 Safari 标签不关，切网络也能用

---

## 📥 导入词汇

支持三种方式：

| 方式 | 操作 |
|------|------|
| CSV 文件 | 点击上传区选择文件（格式：`english,chinese`） |
| 粘贴文本 | 每行一个：`英文 中文`（空格或Tab分隔） |
| 手动添加 | 输入英文 + 中文，点添加 |

---

## 🎯 筛查测试

1. 选择范围：全部单词 / 仅错题
2. 开始筛查，看英文选中文
3. **👈 左滑** 下一题，**👉 右滑** 回看上一题
4. 完成后查看成绩，可选择再来一轮

---

## 📤 导出

- **CSV**：Excel / Numbers 可打开
- **打印**：可保存为 PDF

导出表格包含：英文 | 中文 | 掌握状态 | 错误次数

---

## 📂 项目结构

```
dan-ci-qi/
├── app.py                    # Flask 后端
├── requirements.txt          # Python 依赖
├── templates/index.html      # 电脑版前端
├── static/                   # CSS、JS、Service Worker
├── 单词器_iPhone离线版.html   # iPhone 离线版（单文件）
└── README.md
```

---

## 🛠 技术栈

- **后端**：Python Flask + SQLite
- **前端**：原生 HTML/CSS/JS，移动端优先
- **导出**：python-docx（Word）、reportlab（PDF）
- **离线**：Service Worker + localStorage
