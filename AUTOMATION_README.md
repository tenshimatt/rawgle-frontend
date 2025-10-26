# Rawgle Automated Testing Pipeline

## 🚀 Overview

This pipeline automates code generation, testing, and deployment using:
- **OpenProject** - Task management with specs stored in task descriptions
- **n8n** - Workflow orchestration
- **Claude AI** - Code generation
- **Jenkins** - Testing and CI/CD
- **GitHub** - Version control

## 📁 Files in This Repository

```
/
├── n8n-auto-testing-workflow.json    # Import this into n8n
├── OPENPROJECT_TASK_TEMPLATE.md      # How to structure tasks
├── N8N_SETUP_GUIDE.md                # Complete setup instructions
├── AUTOMATION_README.md              # This file
└── specs/
    └── features/
        └── *.yml                      # Feature specifications
```

## 🎯 Quick Start

### 1. **Set Up Credentials** (15 minutes)

You need these API keys ready:

| Service | Where to Get It | What You Need |
|---------|----------------|---------------|
| **OpenProject** | My Account → Access Tokens | API Token |
| **Claude/Anthropic** | https://console.anthropic.com/settings/keys | API Key |
| **GitHub** | Settings → Developer settings → PAT | Personal Access Token (repo, workflow) |
| **Jenkins** | User → Configure → API Token | API Token |
| **Vercel** (optional) | Settings → Tokens | Token |

### 2. **Import n8n Workflow** (5 minutes)

1. Open n8n
2. Workflows → Import from File
3. Upload `n8n-auto-testing-workflow.json`
4. Assign credentials to each node
5. Activate workflow

### 3. **Configure OpenProject Webhook** (5 minutes)

1. OpenProject → Administration → Webhooks
2. Create webhook pointing to: `http://your-n8n:5678/webhook/openproject-task-update`
3. Enable "Work package updated" event

### 4. **Create Your First Task** (10 minutes)

Use the template in `OPENPROJECT_TASK_TEMPLATE.md`:

```markdown
[AUTO] Hello World - Test Feature

## Feature Requirements
Create a simple page that displays "Hello World"

...

### AUTOMATION METADATA

SPEC_FILE: /specs/features/hello-world.yml
GOOD_EXAMPLES: /src/app/page.tsx
TARGET_FILES: /src/app/hello/page.tsx
```

### 5. **Trigger Pipeline**

Move task to **"In Progress"** status → Automation runs!

## 🔄 How It Works

```
OpenProject Task (In Progress)
    ↓
n8n Webhook Triggered
    ↓
Fetch Spec File + Good Examples from GitHub
    ↓
Call Claude API with Comprehensive Prompt
    ↓
Claude Generates Code + Tests
    ↓
Jenkins Runs Test Suite
    ↓ (success)
Post Results to OpenProject Comment
Update Status to "Ready for Review"
```

## 📋 Task Template Structure

Every OpenProject task needs:

### Required Fields in Description:
```
SPEC_FILE: /specs/features/feature-name.yml
GOOD_EXAMPLES: /path/to/example1.tsx, /path/to/example2.ts
TARGET_FILES: /src/app/feature/page.tsx, /src/components/Feature.tsx
```

### Spec File Format (YAML):
```yaml
feature: Feature Name
module: module-name
priority: high|medium|low
complexity: high|medium|low

requirements:
  - Requirement 1
  - Requirement 2

acceptance_criteria:
  - Criterion 1
  - Criterion 2

api_endpoints:
  - POST /api/endpoint
    params:
      - field: type

tests_required:
  unit: [...]
  integration: [...]
  e2e: [...]

good_examples:
  - /path/to/example.tsx

dependencies:
  - Dependency 1
```

## 🛠️ Required Credentials Summary

### In n8n Settings → Credentials:

1. **OpenProject API** (HTTP Header Auth)
   - Header: `Authorization`
   - Value: `Basic YOUR_BASE64_API_KEY`

2. **Claude API** (HTTP Header Auth)
   - Header: `x-api-key`
   - Value: `sk-ant-api03-YOUR_KEY`

3. **GitHub API** (GitHub Credential)
   - Access Token: `ghp_YOUR_TOKEN`

4. **Jenkins API** (HTTP Basic Auth)
   - Username: `your-user`
   - Password: `jenkins-api-token`

5. **Vercel API** (HTTP Header Auth) - Optional
   - Header: `Authorization`
   - Value: `Bearer YOUR_TOKEN`

### In n8n Environment Variables:

```bash
GITHUB_OWNER=your-username
GITHUB_REPO=rawgle-frontend
JENKINS_URL=http://jenkins:8080
OPENPROJECT_URL=https://openproject.example.com
OPENPROJECT_STATUS_READY_FOR_REVIEW=7
OPENPROJECT_STATUS_FAILED=8
```

## 📊 What Gets Posted to OpenProject

### On Success:
```
✅ Automated Tests PASSED

## Generated Code Summary
[Claude's summary]

## Files Modified
- /src/app/feature/page.tsx
- /src/components/Feature.tsx

## Test Results
- Unit Tests: ✅ Passed
- E2E Tests: ✅ Passed
- Type Check: ✅ Passed

## Testing Instructions
[How to test manually]

Branch: auto-task-123
Jenkins Build: http://jenkins/job/123
```

### On Failure:
```
❌ Automated Tests FAILED

## Test Failures
[Error details]

## Error Logs
[Console output]

Claude will attempt to fix...

Branch: auto-task-123
```

## 🎓 Best Practices

### Writing Good Specs
- ✅ Be specific about UI/UX behavior
- ✅ Include error handling requirements
- ✅ Specify API contracts precisely
- ✅ List all edge cases
- ❌ Don't be vague ("make it nice")
- ❌ Don't skip acceptance criteria

### Choosing Good Examples
- ✅ Pick similar complexity level
- ✅ Use recently reviewed code
- ✅ Include both component + API examples
- ✅ Ensure examples follow best practices
- ❌ Don't use outdated patterns
- ❌ Don't mix different coding styles

### Target Files
- ✅ List ALL files (code + tests)
- ✅ Use absolute paths from repo root
- ✅ Include type definitions
- ❌ Don't forget test files
- ❌ Don't use relative paths

## 🐛 Troubleshooting

### Webhook not triggering?
```bash
# Test webhook manually
curl -X POST http://n8n:5678/webhook-test/openproject-task-update \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Claude API errors?
- Check API key is valid
- Verify rate limits at console.anthropic.com
- Ensure model name is correct: `claude-sonnet-4-20250514`

### Jenkins not starting?
- Verify Jenkins URL is accessible
- Check credentials
- Ensure pipeline job exists

### No comment posted to OpenProject?
- Check n8n execution logs
- Verify OpenProject API credentials
- Ensure task URL is valid

## 📈 Monitoring

### n8n Executions
- Go to **Executions** tab
- See all workflow runs
- Click to see node-by-node data
- Red nodes = errors

### Jenkins Build History
- Jenkins → Job → Build History
- Click build number → Console Output
- Check for test failures

### OpenProject Task Comments
- All results appear as comments
- Status auto-updates on success
- Error logs included on failure

## 🚢 Next Steps

1. ✅ Set up all credentials
2. ✅ Import n8n workflow
3. ✅ Configure OpenProject webhook
4. ✅ Create test task with simple feature
5. ✅ Watch it run end-to-end
6. ✅ Iterate on prompts
7. ✅ Add more good examples
8. ✅ Scale to full project

## 💡 Tips for Success

- **Start Simple**: Test with "Hello World" first
- **Iterate Prompts**: Refine Claude prompts based on output quality
- **Build Example Library**: More good examples = better code generation
- **Write Detailed Specs**: Claude works best with clear requirements
- **Monitor First Runs**: Watch n8n executions closely initially
- **Use Retry Logic**: The workflow auto-retries failed tests with error context

## 📚 Additional Documentation

- `OPENPROJECT_TASK_TEMPLATE.md` - Detailed task template guide
- `N8N_SETUP_GUIDE.md` - Step-by-step setup instructions
- `/specs/features/*.yml` - Example spec files

## 🤝 Support

- Check n8n execution logs for workflow errors
- Review Jenkins console output for test failures
- OpenProject comments show full error details
- All documentation lives in OpenProject tasks

---

**Built with ❤️ to automate testing and catch bugs automatically**
