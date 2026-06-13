/**
 * 单词筛查背诵器 — 前端交互逻辑
 * 移动端优先 · 原生 JS · 无依赖
 */

// ═══════════════════════════════════════════════
//  API 工具函数
// ═══════════════════════════════════════════════

async function api(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `请求失败 (${res.status})`);
    }
    return data;
  } catch (err) {
    if (err.message && !err.message.includes("Failed to fetch")) {
      toast(err.message);
    } else if (err.message && err.message.includes("Failed to fetch")) {
      toast("网络连接失败，请检查服务是否启动");
    }
    throw err;
  }
}

// ═══════════════════════════════════════════════
//  Toast 提示
// ═══════════════════════════════════════════════

let toastTimer;

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2500);
}

// ═══════════════════════════════════════════════
//  Tab 切换
// ═══════════════════════════════════════════════

const tabs = ["import", "quiz", "errors", "export"];

function switchTab(tabName) {
  // 更新内容区
  document.querySelectorAll(".tab-page").forEach((s) => s.classList.remove("active"));
  document.getElementById(`tab-${tabName}`).classList.add("active");

  // 更新底部导航
  document.querySelectorAll(".bottom-nav .nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });

  // 更新桌面导航
  document.querySelectorAll(".desktop-nav .nav-btn-d").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });

  // 切到对应 tab 时加载数据
  if (tabName === "import") loadWords();
  if (tabName === "errors") loadErrors();
  if (tabName === "quiz") updateQuizWordCount();
  if (tabName === "export") updateExportCount();
}

// 底部导航点击
document.querySelectorAll(".bottom-nav .nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// 桌面导航点击
document.querySelectorAll(".desktop-nav .nav-btn-d").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// ═══════════════════════════════════════════════
//  单词管理
// ═══════════════════════════════════════════════

async function loadWords() {
  try {
    const words = await api("/api/words");
    renderWordList(words);
    updateWordCount(words.length);
  } catch (_) {
    // api() already shows toast
  }
}

function renderWordList(words) {
  const container = document.getElementById("word-list");
  const countEl = document.getElementById("word-list-count");

  countEl.textContent = `(${words.length} 个)`;

  if (words.length === 0) {
    container.innerHTML = '<p class="empty-hint">暂无单词，请导入或添加</p>';
    return;
  }

  container.innerHTML = words
    .map(
      (w) => `
    <div class="word-item">
      <div>
        <span class="eng">${esc(w.english)}</span>
        <span class="chn">${esc(w.chinese)}</span>
      </div>
      <button class="del-btn" data-id="${w.id}" title="删除">×</button>
    </div>`
    )
    .join("");

  // 绑定删除按钮
  container.querySelectorAll(".del-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await api(`/api/words/${btn.dataset.id}`, { method: "DELETE" });
      loadWords();
    });
  });
}

function updateWordCount(count) {
  document.getElementById("word-count-badge").textContent = `${count} 词`;
  updateQuizWordCount();
  updateExportCount();
}

// ─── 手动添加 ───
document.getElementById("btn-manual-add").addEventListener("click", async () => {
  const engEl = document.getElementById("manual-english");
  const chnEl = document.getElementById("manual-chinese");
  const english = engEl.value.trim();
  const chinese = chnEl.value.trim();

  if (!english || !chinese) {
    toast("请输入英文和中文");
    return;
  }

  try {
    await api("/api/words", {
      method: "POST",
      body: JSON.stringify({ english, chinese }),
    });
    engEl.value = "";
    chnEl.value = "";
    engEl.focus();
    loadWords();
    toast(`已添加: ${english}`);
  } catch (_) {}
});

// 回车快捷添加
document.getElementById("manual-chinese").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("btn-manual-add").click();
});

// ─── 文件上传 ───
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");

uploadArea.addEventListener("click", () => fileInput.click());

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) processFile(file);
});

async function processFile(file) {
  fileNameEl.textContent = `已选择: ${file.name}`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/words/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.ok) {
      toast(`导入成功: ${data.added} 个单词${data.skipped > 0 ? `，${data.skipped} 个跳过（重复）` : ""}`);
      loadWords();
    } else {
      toast(data.error || "导入失败");
    }
  } catch (_) {}
}

// ─── 文本粘贴导入 ───
document.getElementById("btn-paste-import").addEventListener("click", async () => {
  const text = document.getElementById("paste-text").value.trim();
  if (!text) {
    toast("请先粘贴单词文本");
    return;
  }

  try {
    const res = await fetch("/api/words/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (data.ok) {
      toast(`导入成功: ${data.added} 个单词${data.skipped > 0 ? `，${data.skipped} 个跳过（重复）` : ""}`);
      document.getElementById("paste-text").value = "";
      loadWords();
    } else {
      toast(data.error || "导入失败");
    }
  } catch (_) {}
});

// ─── 清空全部 ───
document.getElementById("btn-clear-all").addEventListener("click", async () => {
  if (!confirm("确定要删除全部单词吗？此操作不可撤销。")) return;
  await api("/api/words/all", { method: "DELETE" });
  loadWords();
  toast("已清空全部单词");
});

// ═══════════════════════════════════════════════
//  筛查测试
// ═══════════════════════════════════════════════

let quizState = {
  sessionId: null,
  total: 0,
  answered: false,
};

async function updateQuizWordCount() {
  try {
    const words = await api("/api/words");
    const errors = await api("/api/errors");
    document.getElementById("quiz-word-count").textContent =
      `当前词库 ${words.length} 个单词，其中错题 ${errors.length} 个`;
  } catch (_) {}
}

document.getElementById("btn-start-quiz").addEventListener("click", async () => {
  const mode = document.querySelector('input[name="quiz-mode"]:checked').value;

  try {
    const data = await api(`/api/quiz/start?mode=${mode}`, { method: "POST" });

    quizState.sessionId = data.session_id;
    quizState.total = data.total;
    quizState.answered = false;

    // 切换到答题界面
    document.getElementById("quiz-setup").classList.add("hidden");
    document.getElementById("quiz-active").classList.remove("hidden");
    document.getElementById("quiz-finished").classList.add("hidden");

    // 显示第一题
    displayQuestion(data.question);
    updateProgress(1, data.total);
  } catch (_) {}
});

function displayQuestion(question) {
  quizState.answered = false;

  document.getElementById("quiz-word").textContent = question.english;
  document.getElementById("quiz-feedback").classList.add("hidden");
  document.getElementById("btn-next").classList.add("hidden");

  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = question.options
    .map(
      (opt, i) =>
        `<button class="option-btn" data-answer="${esc(opt)}" data-index="${i}">${esc(opt)}</button>`
    )
    .join("");

  // 绑定点击事件
  optionsContainer.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn, question));
  });
}

async function handleAnswer(btn, question) {
  if (quizState.answered) return;
  quizState.answered = true;

  const selected = btn.dataset.answer;

  // 禁用所有选项
  document.querySelectorAll(".option-btn").forEach((b) => b.classList.add("disabled"));

  try {
    const data = await api(`/api/quiz/${quizState.sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ word_id: question.word_id, selected }),
    });

    // 高亮选项
    document.querySelectorAll(".option-btn").forEach((b) => {
      if (b.dataset.answer === data.correct_answer) {
        b.classList.add("reveal");
      }
      if (b === btn && !data.is_correct) {
        b.classList.add("wrong");
      }
      if (b === btn && data.is_correct) {
        b.classList.add("correct");
      }
    });

    // 显示反馈
    const feedback = document.getElementById("quiz-feedback");
    feedback.classList.remove("hidden", "correct-fb", "wrong-fb");

    if (data.is_correct) {
      feedback.classList.add("correct-fb");
      document.getElementById("feedback-icon").textContent = "✅";
      document.getElementById("feedback-text").textContent = "回答正确！";
      document.getElementById("feedback-answer").textContent = "";
    } else {
      feedback.classList.add("wrong-fb");
      document.getElementById("feedback-icon").textContent = "❌";
      document.getElementById("feedback-text").textContent = "回答错误";
      document.getElementById("feedback-answer").textContent =
        `正确答案：${data.correct_answer}`;
    }

    updateProgress(data.current, data.total);

    if (data.finished) {
      // 筛查完成
      document.getElementById("btn-next").classList.add("hidden");
      setTimeout(() => showResults(data.result), 1200);
    } else {
      // 显示"下一题"按钮
      const nextBtn = document.getElementById("btn-next");
      nextBtn.classList.remove("hidden");
      nextBtn.textContent = data.current >= data.total ? "查看结果" : "下一题";
      nextBtn.onclick = async () => {
        if (data.next_question) {
          displayQuestion(data.next_question);
        }
      };
    }
  } catch (_) {}
}

function updateProgress(current, total) {
  const pct = Math.round((current / total) * 100);
  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.getElementById("progress-text").textContent = `${current}/${total}`;
}

function showResults(result) {
  document.getElementById("quiz-active").classList.add("hidden");
  document.getElementById("quiz-finished").classList.remove("hidden");

  document.getElementById("result-total").textContent = result.total;
  document.getElementById("result-correct").textContent = result.correct;
  document.getElementById("result-wrong").textContent = result.wrong;
  document.getElementById("result-accuracy").textContent = `${result.accuracy}%`;
}

// 再来一轮（仅错题）
document.getElementById("btn-retry-errors").addEventListener("click", async () => {
  document.querySelector('input[name="quiz-mode"][value="errors"]').checked = true;
  document.getElementById("quiz-finished").classList.add("hidden");
  document.getElementById("quiz-setup").classList.remove("hidden");
  document.getElementById("btn-start-quiz").click();
});

// 重新筛查全部
document.getElementById("btn-new-quiz").addEventListener("click", () => {
  document.querySelector('input[name="quiz-mode"][value="all"]').checked = true;
  document.getElementById("quiz-finished").classList.add("hidden");
  document.getElementById("quiz-setup").classList.remove("hidden");
});

// 退出筛查（返回设置页面）
document.getElementById("btn-quit-quiz").addEventListener("click", () => {
  if (quizState.answered || confirm("确定要退出当前筛查吗？已答题目不会保存。")) {
    document.getElementById("quiz-active").classList.add("hidden");
    document.getElementById("quiz-setup").classList.remove("hidden");
    document.getElementById("quiz-finished").classList.add("hidden");
    quizState.sessionId = null;
  }
});

// ═══════════════════════════════════════════════
//  错题本
// ═══════════════════════════════════════════════

async function loadErrors() {
  try {
    const errors = await api("/api/errors");
    renderErrors(errors);
  } catch (_) {}
}

function renderErrors(errors) {
  const emptyEl = document.getElementById("errors-empty");
  const tableEl = document.getElementById("errors-table");
  const tbody = document.getElementById("errors-tbody");

  if (errors.length === 0) {
    emptyEl.classList.remove("hidden");
    tableEl.classList.add("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  tableEl.classList.remove("hidden");

  tbody.innerHTML = errors
    .map(
      (e) => `
    <tr>
      <td><strong>${esc(e.english)}</strong></td>
      <td>${esc(e.chinese)}</td>
      <td style="text-align:center;color:var(--danger);font-weight:600;">${e.error_count}</td>
    </tr>`
    )
    .join("");
}

// ═══════════════════════════════════════════════
//  导出
// ═══════════════════════════════════════════════

async function updateExportCount() {
  try {
    const errors = await api("/api/errors");
    const words = await api("/api/words");
    document.getElementById("export-count").textContent =
      `错题 ${errors.length} 个 | 全部单词 ${words.length} 个`;
  } catch (_) {}
}

document.getElementById("btn-export-pdf").addEventListener("click", () => {
  const type = document.querySelector('input[name="export-type"]:checked').value;
  window.open(`/export/pdf?type=${type}`, "_blank");
  toast("PDF 下载已开始");
});

document.getElementById("btn-export-word").addEventListener("click", () => {
  const type = document.querySelector('input[name="export-type"]:checked').value;
  window.open(`/export/word?type=${type}`, "_blank");
  toast("Word 下载已开始");
});

// ═══════════════════════════════════════════════
//  工具函数
// ═══════════════════════════════════════════════

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════
//  初始化
// ═══════════════════════════════════════════════

async function init() {
  await loadWords();
  await updateQuizWordCount();
  await updateExportCount();
}

init();
