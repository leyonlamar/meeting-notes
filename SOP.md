# Meeting Notes & Action Intelligence — Standard Operating Procedures

## 1. Application Overview

Meeting Notes is a local-first desktop application that transforms raw meeting notes into structured, actionable outputs. It runs on Windows as a portable or installed application.

---

## 2. Getting Started

### 2.1 Launch the Application
- **Installed:** Open "Meeting Notes" from the Start menu
- **Portable:** Run `meeting-notes.exe` from the portable folder

### 2.2 First-Time Setup
1. The app opens to the **Dashboard**
2. Click **"Load Sample Data"** to populate 2 sample meetings and 5 action items, OR
3. Click **"New Meeting"** to start fresh

### 2.3 Configure AI Provider (Optional)
1. Navigate to **Settings** (left sidebar)
2. Under **AI Provider**, select a provider:
   - `mock` — Offline demo mode (default, no setup needed)
   - `openai-compatible` — Works with Ollama, LM Studio, or OpenAI
3. Enter the **Endpoint URL** (e.g., `http://localhost:11434/v1` for Ollama)
4. Enter the **Model Name** (e.g., `llama3`)
5. If using OpenAI, enter your **API Key** (stored securely in Windows Credential Store)
6. Click **Save Settings**

---

## 3. Core Workflows

### 3.1 Capturing Meeting Notes

**Create a new meeting:**
1. Click **"New Meeting"** from Dashboard or Meetings page
2. Click the meeting title to rename it
3. You are taken to the **Meeting Detail** page

**Enter notes (Raw Notes tab):**
- **Type directly** during the meeting
- **Paste** transcripts from Teams, Zoom, or Google Meet
- **Import** a `.txt` or `.md` file using the **Import** button
- Click **"+ Timestamp"** to insert a time marker
- Notes **autosave every 30 seconds**
- Click **Save** to save manually at any time

**Important:** Raw notes are the source of truth and are never modified by AI.

### 3.2 AI-Powered Processing

From the **Raw Notes** tab, use the AI action buttons:

| Button | What It Does |
|--------|-------------|
| **Extract Actions** | Scans notes for action items, owners, deadlines, priorities |
| **Generate Minutes** | Creates structured meeting minutes with executive summary |

**Human-in-the-loop review:**
1. After extraction, the **Review Panel** appears
2. Each extracted item shows: text, confidence score, owner, due date
3. For each item, you can:
   - **Accept** (green checkmark) — confirms the item
   - **Reject** (red X) — discards the item
   - **Edit** — modify the text inline before accepting
4. Click **"Save N Items"** to commit accepted items to the database
5. Items marked **"Tentative"** (purple badge) have lower confidence and need review

### 3.3 Reviewing Meeting Minutes

1. Go to the **Minutes** tab
2. View the AI-generated structured minutes
3. Minutes marked as **"Draft"** have not been formally accepted
4. Content includes: Executive Summary, Key Discussion Points, and full markdown

### 3.4 Managing Action Items

**From Meeting Detail (Actions tab):**
- Click **"Add Action Item"** to create manually
- Click the **pencil icon** to inline-edit title, owner, due date
- Use the **status dropdown** to change status (Open → In Progress → Done)
- Check the **checkbox** to mark as Done
- Click **X** to delete

**From global Action Items page (sidebar):**
- View all action items across all meetings
- Filter by status: **Open**, **In Progress**, **Done**, **All**
- Change status inline via dropdown
- Click an item to navigate to its source meeting

**Action Item fields:**
| Field | Description |
|-------|-------------|
| Title | What needs to be done |
| Owner | Person responsible |
| Due Date | Deadline |
| Priority | Low, Medium, High, Critical |
| Status | Open, In Progress, Done, Cancelled |
| Tentative | AI-extracted with lower confidence |
| Confidence | 0–100% certainty score |
| Source Snippet | Original text it was extracted from |

### 3.5 Viewing Decisions, Deliverables, Risks & Questions

1. Go to Meeting Detail → **"Decisions & More"** tab
2. View four sections:
   - **Decisions** — What was agreed upon
   - **Deliverables** — Expected outputs with owners and dates
   - **Risks & Blockers** — Identified risks, blockers, dependencies
   - **Open Questions** — Unresolved items needing follow-up
3. Each item may show a **Tentative** badge if AI confidence is low

### 3.6 Searching Meetings

**From Meetings page:**
- Type in the **search bar** to search across all meeting titles and content
- Search uses **full-text search** (FTS5) — finds partial words and phrases
- Results update as you type (300ms debounce)

### 3.7 Exporting Data

**From Meeting Detail → Export tab:**

| Format | What's Exported | Use Case |
|--------|----------------|----------|
| **Markdown** | Full structured minutes | Documentation, sharing |
| **CSV** | Action items as spreadsheet rows | Excel import, reporting |
| **JSON** | Action items as structured data | Integration, automation |

**Steps:**
1. Click the export button
2. Choose a save location via the file dialog
3. File is written to disk

**Excel Integration:** The JSON and CSV formats use flat, portable field names designed for direct import into Excel. See `samples/EXCEL_INTEGRATION_GUIDE.md` for details.

---

## 4. Dashboard

The Dashboard provides an at-a-glance overview:

| Widget | Shows |
|--------|-------|
| **Recent Meetings** | Last 5 meetings with status and action count |
| **Open Action Items** | Count of all non-completed items |
| **Overdue Items** | Count of items past their due date (red highlight) |

Click any meeting card to open it.

---

## 5. Settings

### 5.1 AI Provider
- **Provider:** Select mock or openai-compatible
- **Endpoint URL:** API endpoint for local or cloud models
- **Model Name:** Which model to use

### 5.2 API Key Management
- Keys are stored in **Windows Credential Store** (never in config files)
- Green "Key stored" badge confirms a key exists
- "Remove Key" deletes the stored credential

### 5.3 General
- **Default Export Format:** Markdown, TXT, CSV, or JSON
- **Autosave Interval:** How often notes auto-save (default: 30 seconds)

### 5.4 Storage
- Shows current mode: **Portable** or **Standard**
- Shows the data directory path

---

## 6. Portable Mode

### 6.1 How to Enable
Place either of these next to `meeting-notes.exe`:
- An empty file named `portable`
- OR a folder named `data/`

### 6.2 Data Location
- **Portable mode:** `<exe_dir>/data/` (db, config, exports, logs)
- **Standard mode:** `%APPDATA%/meeting-notes/`

### 6.3 Moving the App
In portable mode, copy the entire folder (exe + data/) to any location. All data travels with the app.

---

## 7. Data Safety

| Aspect | Detail |
|--------|--------|
| **Storage** | SQLite database with WAL mode for crash safety |
| **Autosave** | Notes auto-save every 30 seconds |
| **Soft Delete** | Deleted meetings/items are marked, not erased |
| **Raw Notes** | Original text is preserved and never modified |
| **API Keys** | Windows Credential Store, never plaintext |
| **Offline** | Core features work without internet |
| **AI Data** | When using API-based AI, note content is sent to the configured endpoint |

---

## 8. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Click meeting title | Edit title inline |
| Enter (while editing title) | Save title |
| Tab between fields | Navigate action item edit form |

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Ensure Windows 10 22H2+ with WebView2 installed |
| AI not working | Check Settings: provider, endpoint, model are correct |
| No results from AI | Verify Ollama/LM Studio is running, or API key is stored |
| Database locked | Close other instances of the app |
| Missing data after move | Ensure `data/` folder was copied with the exe |
