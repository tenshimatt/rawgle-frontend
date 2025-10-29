# OpenProject Automation Setup

## Project Structure for Automation

### Recommended Setup: Dedicated Automation Project

**Create a project in OpenProject called:** `Rawgle Auto Development`

**Why a dedicated project?**
- ✅ All automated tasks in one place
- ✅ Easy to filter and manage
- ✅ Can enable/disable automation by project
- ✅ Clear separation from manual tasks
- ✅ Better reporting and tracking
- ✅ Future: Add project-level webhook filters

---

## Step-by-Step OpenProject Setup

### 1. Create Automation Project (5 minutes)

1. Go to OpenProject → **Projects**
2. Click **+ Project**
3. Fill in:
   - **Name:** `Rawgle Auto Development`
   - **Identifier:** `rawgle-auto` (auto-generated)
   - **Description:** `Automated code generation and testing via n8n pipeline`
   - **Public:** No (keep private)
4. Click **Create**

### 2. Configure Project Statuses

The project needs these work package statuses:

**Required Statuses:**
1. **New** (ID: 1) - Default for new tasks
2. **In Progress** (ID: 2) - ⚡ **TRIGGERS AUTOMATION**
3. **Testing** (ID: 3) - Code generated, tests running
4. **Ready for Review** (ID: 7) - Tests passed, ready for human review
5. **Failed** (ID: 8) - Tests failed, needs attention
6. **Closed** (ID: 5) - Completed and merged

**To configure:**
1. OpenProject → **Administration** → **Work packages** → **Status**
2. Verify status IDs match above
3. If different, update n8n environment variables

### 3. Configure Webhook (10 minutes)

**Webhook Configuration:**
1. OpenProject → **Administration** → **System Settings** → **API and webhooks**
2. Scroll to **Webhooks** section
3. Click **+ Webhook**

**Webhook Settings:**
```
Name: n8n Automation Pipeline
URL: http://10.90.10.6:5678/webhook/openproject-task-update
Description: Triggers automated code generation when task moves to "In Progress"

Events to trigger:
☑ Work package created
☑ Work package updated

Project filter:
☑ Specific projects only
  ☑ Rawgle Auto Development

Secret: [leave empty or set if needed]
Enabled: ☑ Yes
```

**Important:** By selecting "Specific projects only" → "Rawgle Auto Development", the webhook will ONLY trigger for tasks in that project!

### 4. Update n8n Environment Variables

The workflow needs to know the project and status IDs.

**Environment Variables to Set:**

```bash
# OpenProject Configuration
OPENPROJECT_URL=http://10.90.10.7/openproject
OPENPROJECT_PROJECT_ID=rawgle-auto
OPENPROJECT_STATUS_IN_PROGRESS=2
OPENPROJECT_STATUS_TESTING=3
OPENPROJECT_STATUS_READY_FOR_REVIEW=7
OPENPROJECT_STATUS_FAILED=8

# GitHub Configuration
GITHUB_OWNER=tenshimatt
GITHUB_REPO=rawgle-frontend

# Jenkins Configuration
JENKINS_URL=http://10.90.10.45:8080
```

**How to set (if using Docker):**
```bash
docker exec -it n8n-container sh
# Or add to docker-compose.yml environment section
```

**Or hardcode in n8n workflow nodes** (quick fix):
- Replace `{{$env.OPENPROJECT_STATUS_READY_FOR_REVIEW}}` with `7`
- Replace `{{$env.GITHUB_OWNER}}` with `tenshimatt`
- etc.

---

## Task Template for Automation Project

When creating tasks in `Rawgle Auto Development` project, use this format:

### Task Structure

**Subject Format:**
```
[AUTO] Feature Name
```

**Description Format:**
```markdown
## Feature Requirements
[What needs to be built]

## Technical Requirements
- Framework: Next.js 15.5.6
- Styling: Tailwind CSS
- [Other tech specs]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

### AUTOMATION METADATA

SPEC_FILE: /specs/features/feature-name.yml

GOOD_EXAMPLES: /path/to/example1.tsx, /path/to/example2.ts

TARGET_FILES: /src/app/feature/page.tsx, /src/components/Feature.tsx

---

## Testing Instructions
1. Step 1
2. Step 2
3. Step 3
```

### Required Metadata Fields

The n8n workflow parses these from the task description:

| Field | Format | Example |
|-------|--------|---------|
| `SPEC_FILE` | Path to YAML spec in repo | `/specs/features/hello-world.yml` |
| `GOOD_EXAMPLES` | Comma-separated file paths | `/src/app/page.tsx, /src/components/Header.tsx` |
| `TARGET_FILES` | Files to create/modify | `/src/app/hello/page.tsx` |

**Important:** These fields MUST be present and correctly formatted!

---

## Workflow Trigger Logic

The n8n workflow triggers when:

1. ✅ Work package is in project: `Rawgle Auto Development`
2. ✅ Action = `updated`
3. ✅ Status changes to `In Progress`
4. ✅ Task description contains `SPEC_FILE:`, `GOOD_EXAMPLES:`, `TARGET_FILES:`

### What Happens When Triggered:

```
1. OpenProject webhook fires → n8n receives event
2. n8n filters: "In Progress" tasks only
3. n8n fetches task details via OpenProject API
4. n8n parses SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES
5. n8n fetches spec file from GitHub
6. n8n fetches example code from GitHub
7. n8n builds prompt for Claude
8. Claude generates code
9. n8n triggers Jenkins test pipeline
10. n8n posts results back to OpenProject
11. n8n updates task status (Ready for Review or Failed)
```

---

## Alternative: Tag-Based Filtering (Future Enhancement)

If you prefer tags instead of a dedicated project:

**Tag Approach:**
- Add tag: `automation` or `auto-generate`
- Update n8n workflow to filter by tag
- Modify webhook filter or add n8n conditional logic

**Pros:**
- ✅ Works across multiple projects
- ✅ More flexible

**Cons:**
- ❌ Harder to manage
- ❌ More complex webhook filtering
- ❌ Risk of accidental automation triggers

**Recommendation:** Start with dedicated project, add tag filtering later if needed.

---

## Testing the Setup

### Test Task Example

**Create in OpenProject → Rawgle Auto Development:**

**Subject:** `[AUTO] Hello World Test`

**Description:**
```markdown
## Feature Requirements
Create a simple page that displays "Hello World" to verify automation pipeline.

## Technical Requirements
- Next.js page at /hello
- Display "Hello World" in teal-600 color
- Center text horizontally and vertically
- Responsive design

## Acceptance Criteria
- [ ] Page renders at /hello route
- [ ] Text "Hello World" is visible
- [ ] Text uses teal-600 color
- [ ] Text is centered
- [ ] Responsive on mobile

---

### AUTOMATION METADATA

SPEC_FILE: /specs/features/hello-world.yml

GOOD_EXAMPLES: /src/app/page.tsx

TARGET_FILES: /src/app/hello/page.tsx

---

## Testing Instructions
1. Run npm run dev
2. Navigate to http://localhost:3005/hello
3. Verify text displays correctly
```

**To trigger automation:**
1. Save the task (Status: New)
2. Move task to **In Progress**
3. Watch n8n Executions tab: http://10.90.10.6:5678
4. Wait 2-3 minutes for full pipeline
5. Check task comments for results

---

## Monitoring and Debugging

### Check Workflow Execution

1. **n8n Executions:** http://10.90.10.6:5678 → Executions
   - Green nodes = success
   - Red nodes = error
   - Click node to see data

2. **Jenkins Build:** http://10.90.10.45:8080
   - Check console output
   - View test results

3. **OpenProject Comments:**
   - Success: ✅ comment with code summary
   - Failure: ❌ comment with error details

### Common Issues

**Webhook not triggering?**
- Verify webhook enabled in OpenProject
- Check project filter includes "Rawgle Auto Development"
- Verify URL: http://10.90.10.6:5678/webhook/openproject-task-update

**Task description parsing fails?**
- Ensure metadata fields exactly match format
- Check for typos in field names
- Verify paths are correct

**GitHub API fails?**
- Verify SPEC_FILE path exists in repo
- Check GitHub credentials in n8n
- Verify file is pushed to master branch

**Claude API fails?**
- Check API key in n8n credentials
- Verify quota not exceeded
- Check prompt isn't too large

**Jenkins fails?**
- Verify Jenkins URL and credentials
- Check if pipeline job exists
- Review Jenkins console logs

---

## Project Structure Summary

```
OpenProject
└── Rawgle Auto Development (Project)
    ├── [AUTO] Hello World Test (Work Package)
    ├── [AUTO] User Profile Page (Work Package)
    ├── [AUTO] Shopping Cart Feature (Work Package)
    └── ... (all automated tasks)

GitHub
└── rawgle-frontend
    └── specs
        └── features
            ├── hello-world.yml
            ├── user-profile.yml
            └── shopping-cart.yml

n8n
└── Auto Testing Pipeline - OpenProject to Claude
    ├── Webhook: /webhook/openproject-task-update
    └── Credentials: OpenProject, GitHub, Claude, Jenkins
```

---

## Next Steps

- [x] Create spec file (hello-world.yml) ✅
- [ ] Create OpenProject project: "Rawgle Auto Development"
- [ ] Configure webhook with project filter
- [ ] Create test task
- [ ] Move task to "In Progress"
- [ ] Monitor n8n execution
- [ ] Review results in OpenProject

---

## Environment Variables Checklist

Copy these to your n8n environment:

```bash
# Verify these are set
OPENPROJECT_URL=http://10.90.10.7/openproject
OPENPROJECT_STATUS_READY_FOR_REVIEW=7
OPENPROJECT_STATUS_FAILED=8
GITHUB_OWNER=tenshimatt
GITHUB_REPO=rawgle-frontend
JENKINS_URL=http://10.90.10.45:8080
```

**Or hardcode in workflow if env vars not available.**

---

**Ready to test!** Create the project and webhook, then create the test task.
