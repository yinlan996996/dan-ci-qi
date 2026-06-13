# 📖 单词筛查背诵器

一个轻量级的单词筛查背诵工具，支持四选一测试、错题本、滑动切换、多格式导出。

---

## 🚀 快速开始

```bash
# 1. 下载项目
git clone https://github.com/yinlan996996/dan-ci-qi.git
cd dan-ci-qi

# 2. 安装依赖（需要 Python 3）
pip install -r requirements.txt

# 3. 启动
python app.py
```

浏览器打开 `http://localhost:5000` 即可使用。

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
