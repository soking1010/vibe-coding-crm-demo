# CRM Demo — Vibe Coding 系統拆解術

> 這是「Vibe Coding 系統拆解術」課程 **講座一：CRM 顧客關係管理系統** 的教學示範專案。
> 用一個講師學員管理系統，展示如何拆解 ER 關聯、狀態機、標籤規則與分群邏輯。

## 快速啟動

```bash
# 本機開發
npm install
npm run dev

# 建置靜態檔案
npm run build
npm run preview
```

也可在 StackBlitz 直接開啟，不需任何環境設定。

---

## 系統結構總覽

### 資料實體關聯 (ER)

```
Student (1) ──── (N) StudentEvent    一位學員有多筆行為事件
Student (M) ──── (N) Tag             多對多（via static_tags[]）
Tag (1) ──── (0..1) DynamicTagRule   動態標籤附帶規則
Student → StudentStatus              由 last_interaction_at 即時計算（不儲存）
```

| 實體 | 說明 |
|------|------|
| **Student** | 核心實體，包含基本資料與最後互動時間 |
| **StudentEvent** | 不可變更的事件記錄（報名、出席、完課、回饋、回購） |
| **Tag** | 靜態標籤（手動指定）與動態標籤（規則即時計算） |
| **StatusThresholds** | 控制活躍/沉睡/流失的天數邊界設定 |

### 狀態機

```
新註冊 ──(任何互動)──→ 活躍 ←──(新互動)── 沉睡 / 流失
                        │                    ↑
                        └──(30+ 天)──→ 沉睡 ──(90+ 天)──→ 流失
```

| 狀態 | 條件 | 說明 |
|------|------|------|
| 新註冊 | 建立後尚無互動 | 等待第一次互動 |
| 活躍 | 最後互動 ≤ 30 天 | 正常參與中 |
| 沉睡 | 最後互動 31–90 天 | 需要再行銷 |
| 流失 | 最後互動 > 90 天 | 需要挽回策略 |

門檻天數可在 Dashboard 即時調整，圖表會即時更新。

### 靜態 vs 動態標籤

| 類型 | 存儲方式 | 範例 | 更新時機 |
|------|----------|------|----------|
| 靜態標籤 | 存在學員資料中 | VIP、企業班、自費 | 手動操作 |
| 動態標籤 | 即時運算 | 活躍學員、高互動、需回訪 | 每次查看時計算 |

### Input → Process → Output

```
輸入 (Input)              處理 (Process)           輸出 (Output)
─────────────           ─────────────           ─────────────
last_interaction_at  →  門檻比較規則         →  學員狀態
events[]             →  事件計數/類型判斷    →  動態標籤
static_tags[]        →  直接讀取             →  靜態標籤
status + tags        →  分群聚合             →  Dashboard 圖表
```

---

## 核心檔案導覽

| 檔案 | 教學重點 |
|------|----------|
| `src/types/index.ts` | ER 圖的程式碼表達 — 看懂這個檔案就看懂資料結構 |
| `src/lib/state-machine.ts` | 狀態機純函式 — 輸入學員 + 門檻，輸出狀態 |
| `src/lib/tag-engine.ts` | 靜態 vs 動態標籤 — stored data vs computed data |
| `src/lib/segmentation.ts` | 分群邏輯 — 把狀態匯總成可行動的分眾 |
| `src/data/students.json` | 40 筆模擬資料 — 觀察資料如何驅動系統行為 |

---

## 頁面說明

| 路徑 | 頁面 | 功能 |
|------|------|------|
| `/` | 分群儀表板 | 狀態圓餅圖 + 標籤長條圖 + 門檻滑桿即時調整 |
| `/students` | 學員名單 | 搜尋篩選 + 學員詳情 + 事件時間軸 + 標籤編輯 |
| `/tags` | 標籤管理 | 靜態/動態標籤對照 + 規則展示 |
| `/events` | 事件記錄 | 全域事件時間軸 + 類型篩選 |
| `/structure` | 系統結構 | ER 圖 + 狀態機圖 + 資料流圖 |

---

## 課堂練習建議

1. 到 Dashboard 拖動門檻滑桿，觀察分群圖表如何即時變化
2. 到學員詳情頁，切換靜態標籤，理解 stored data 的概念
3. 到標籤管理頁，比較靜態與動態標籤的差異
4. 到系統結構頁，對照 ER 圖與 `types/index.ts` 的欄位定義
5. 打開 `src/lib/state-machine.ts`，閱讀 `computeStatus()` 如何用純函式計算狀態

---

## 技術棧

- React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4
- Recharts（圖表）
- Lucide React（圖標）
- 純 JSON 模擬資料，無後端、無資料庫
