# 单词筛查背诵器

一个给个人使用的单词筛查和背诵工具。支持导入词库、八选一筛查、错词记录、进度保存、多档案、数据迁移，以及 iPhone / iPad / 电脑互用。

在线使用地址：

```text
https://yinlan996996.github.io/dan-ci-qi/
```

## 推荐使用方式

### iPhone / iPad

推荐直接使用 GitHub Pages 版本，不需要电脑一直开着：

```text
https://yinlan996996.github.io/dan-ci-qi/
```

第一次打开需要联网。打开后可以把它添加到主屏幕，当成一个独立 App 使用。

操作步骤：

1. 用 Safari 打开上面的地址。
2. 点底部的分享按钮。
3. 选择“添加到主屏幕”。
4. 以后从桌面图标进入。

如果之前已经添加过旧版本，建议先删除旧的桌面图标，再用 Safari 重新添加一次。

### 电脑

电脑也可以直接打开在线版：

```text
https://yinlan996996.github.io/dan-ci-qi/
```

如果要运行本地 Flask 版，需要安装 Python，然后在项目目录执行：

```powershell
pip install -r requirements.txt
python app.py
```

启动后浏览器打开：

```text
http://localhost:5000
```

## 主要功能

- 导入单词：支持 CSV、粘贴文本、手动添加。
- 八选一筛查：看英文，选正确中文释义。
- “我不会”：不会的题可以直接点“我不会”，会记录为错词。
- 左滑 / 右滑：左滑下一题，右滑回看上一题。
- 进度保存：开始筛查默认继续上次进度。
- 重置进度：可以开始新一轮筛查。
- 错词本：自动记录答错和不会的单词。
- 错词轮次：一轮完成后，可以只用错词再来一轮。
- 多档案：可以创建不同档案，分别保存不同词库和进度。
- 数据迁移：可以导出数据文件，再导入到 iPhone、iPad 或电脑。
- 导出背诵表：支持导出 CSV，也可以通过打印保存为 PDF。

## 导入词汇格式

### CSV 文件

CSV 至少需要英文和中文两列，推荐格式：

```csv
english,chinese
abandon,放弃
ability,能力
```

也可以导入已有的 CET6 / TOEFL 词库 CSV。

### 粘贴文本

每行一个单词，英文和中文之间用空格、Tab 或逗号分隔：

```text
abandon 放弃
ability 能力
accurate 准确的
```

### 手动添加

在导入页面输入英文和中文，然后点添加。

## 筛查怎么用

1. 进入“筛查”。
2. 选择“全部单词”或“仅错题”。
3. 点“开始筛查”。
4. 看英文，从 8 个中文选项中选择正确释义。
5. 不会就点“我不会”。
6. 答完后可以左滑下一题，右滑回看上一题。
7. 一轮完成后，可以选择“再来一轮”，并选择全部单词或仅错题。

进度条表示这一轮已经筛查了多少词，不是正确数量。

## 错题本

答错或点“我不会”的单词会自动进入错题本。

错题本会记录：

- 英文
- 中文
- 错误次数
- 最近错误时间

一轮全部词汇筛查完成后，可以自动基于错词开启下一轮排错。

## 多档案

多档案适合下面这些情况：

- CET6 和 TOEFL 分开背。
- 同一套词想重新开始一轮，但不影响旧进度。
- iPhone、iPad、电脑之间分别测试不同进度。

每个档案都有独立的：

- 词库
- 当前筛查进度
- 错题记录
- 轮次记录

## 数据迁移

如果你在 iPhone 做了一半，想转到 iPad 或电脑继续：

1. 在原设备打开“导出”。
2. 选择导出数据文件。
3. 把 JSON 数据文件发送到新设备。
4. 在新设备打开“导入”。
5. 选择导入数据文件。

导入后会恢复词库、错题和进度。

## iPhone / iPad 常见问题

### 换网络后打不开

如果用的是 GitHub Pages 地址，正常不依赖电脑网络：

```text
https://yinlan996996.github.io/dan-ci-qi/
```

如果打不开，先用 Safari 直接打开这个网址，不要从旧桌面图标进。确认能打开后，再重新添加到主屏幕。

### 页面还是旧版本

可以按下面顺序处理：

1. Safari 直接打开在线地址。
2. 下拉刷新页面。
3. 删除旧的主屏幕图标。
4. 重新“添加到主屏幕”。

### iPad 滑动范围太小

新版已经把筛查页的滑动范围扩大到整个页面。更新后需要重新打开在线地址，必要时重新添加到主屏幕。

## 本地项目结构

```text
dan-ci-qi/
├─ app.py                         # Flask 本地版
├─ requirements.txt               # Python 依赖
├─ docs/                          # GitHub Pages 静态版
│  ├─ index.html
│  ├─ manifest.json
│  └─ sw.js
├─ static/                        # 本地 Flask 版前端资源
├─ templates/                     # 本地 Flask 版页面
├─ 单词器_iPhone离线版.html        # 单文件离线版
└─ README.md
```

## 开发者更新到 GitHub

修改完成后，在 VS Code 终端执行：

```powershell
git status
git add README.md docs/index.html docs/sw.js docs/manifest.json
git commit -m "更新使用说明"
git push
```

如果只改了说明文档，也可以只提交：

```powershell
git add README.md
git commit -m "更新使用说明"
git push
```
