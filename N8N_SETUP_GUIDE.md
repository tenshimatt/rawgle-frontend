# n8n Auto Testing Pipeline - Complete Setup Guide

## Prerequisites
- n8n running in Docker
- OpenProject instance
- GitHub repository
- Jenkins instance
- Claude API key
- Vercel account (optional)

---

## Step 1: Set Up n8n Environment Variables

Add these to your n8n Docker container environment (or `.env` file):

```bash
# GitHub Configuration
GITHUB_OWNER=your-github-username
GITHUB_REPO=rawgle-frontend

# Jenkins Configuration
JENKINS_URL=http://your-jenkins-instance:8080

# OpenProject Configuration
OPENPROJECT_URL=https://your-openproject-instance.com
OPENPROJECT_STATUS_READY_FOR_REVIEW=7  # Find this ID in OpenProject API
OPENPROJECT_STATUS_FAILED=8  # Find this ID in OpenProject API

# Optional: Vercel
VERCEL_PROJECT_ID=your-vercel-project-id
```

### How to Find OpenProject Status IDs:
```bash
curl -H "Authorization: Basic YOUR_OPENPROJECT_API_KEY" \
  https://your-openproject-instance.com/api/v3/statuses
```

Look for the `id` field for your desired statuses.

---

## Step 2: Create n8n Credentials (Do This FIRST!)

### 2.1 OpenProject API Credential
1. Go to n8n → **Settings → Credentials → Add Credential**
2. Select **HTTP Header Auth**
3. Name: `OpenProject API`
4. Header Name: `Authorization`
5. Header Value: `Basic YOUR_BASE64_ENCODED_API_KEY`

**How to get your OpenProject API key:**
```bash
# In OpenProject:
# 1. Click your avatar → My Account
# 2. Go to "Access tokens"
# 3. Generate new token
# 4. Encode it:
echo -n "apikey:YOUR_API_KEY" | base64
```

### 2.2 Claude/Anthropic API Credential
1. Add Credential → **HTTP Header Auth**
2. Name: `Claude API`
3. Header Name: `x-api-key`
4. Header Value: `sk-ant-api03-YOUR_ANTHROPIC_KEY`

**Get your key:** https://console.anthropic.com/settings/keys

### 2.3 GitHub API Credential
1. Add Credential → **GitHub**
2. Name: `GitHub API`
3. Access Token: Generate at GitHub → Settings → Developer settings → Personal access tokens
4. Required scopes:
   - `repo` (full control)
   - `workflow` (update workflows)
   - `read:org` (if using organization repos)

### 2.4 Jenkins API Credential
1. Add Credential → **HTTP Basic Auth**
2. Name: `Jenkins API`
3. Username: Your Jenkins username
4. Password: Jenkins API Token (not your password!)

**Get Jenkins API token:**
- Jenkins → User → Configure → API Token → Generate

### 2.5 Vercel API Credential (Optional)
1. Add Credential → **HTTP Header Auth**
2. Name: `Vercel API`
3. Header Name: `Authorization`
4. Header Value: `Bearer YOUR_VERCEL_TOKEN`

**Get token:** Vercel → Settings → Tokens → Create Token

---

## Step 3: Import n8n Workflow

1. In n8n, go to **Workflows → Import from File**
2. Upload `n8n-auto-testing-workflow.json`
3. The workflow will appear with all nodes
4. Click each node and verify credential assignments
5. **Activate the workflow** (toggle in top right)

---

## Step 4: Configure OpenProject Webhook

1. Go to **OpenProject → Administration → Webhooks**
2. Click **+ Webhook**
3. Fill in:
   - **Name:** n8n Auto Testing Pipeline
   - **URL:** `http://YOUR_N8N_HOST:5678/webhook/openproject-task-update`
   - **Description:** Triggers automated testing when task moves to In Progress
   - **Events to subscribe:**
     - ✅ Work package created
     - ✅ Work package updated
   - **All projects** or select specific project
   - **Enabled:** Yes
4. **Save**

### Test the Webhook:
```bash
# Move a test task to "In Progress" in OpenProject
# Check n8n → Executions to see if workflow triggered
```

---

## Step 5: Create GitHub Repository Structure

Your repo needs these directories:

```
rawgle-frontend/
├── specs/
│   └── features/
│       ├── ai-assistant.yml
│       ├── wishlist-bulk-delete.yml
│       └── [more spec files]
├── examples/
│   ├── patterns/
│   │   ├── api-routes/
│   │   │   ├── rest-endpoint.ts
│   │   │   ├── streaming-response.ts
│   │   │   └── error-handling.ts
│   │   ├── components/
│   │   │   ├── form-with-validation.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── modal-dialog.tsx
│   │   └── hooks/
│   │       ├── use-api-query.ts
│   │       └── use-form-state.ts
│   └── complete-features/
│       ├── authentication/
│       └── shopping-cart/
├── src/
├── tests/
└── [rest of your project]
```

---

## Step 6: Create Example Spec File

Create `/specs/features/example-feature.yml`:

```yaml
feature: Example Feature
module: example
priority: medium
complexity: low

requirements:
  - User can perform action X
  - System responds with Y
  - Error handling for Z

acceptance_criteria:
  - User sees confirmation message
  - Data persists across page refresh
  - Mobile responsive design

api_endpoints:
  - POST /api/example
    params:
      - data: string
    response: { success: boolean }

tests_required:
  unit:
    - Data validation logic
    - Error handling
  integration:
    - API integration
  e2e:
    - Complete user flow

good_examples:
  - /src/app/similar-feature/page.tsx
  - /src/app/api/similar-route/route.ts

dependencies:
  - AuthContext
  - Next.js 15
```

---

## Step 7: Configure Jenkins Pipeline

Create a new Jenkins pipeline job named `auto-test-pipeline`:

```groovy
pipeline {
  agent any

  parameters {
    string(name: 'TASK_ID', description: 'OpenProject Task ID')
    text(name: 'GENERATED_CODE', description: 'Claude-generated code JSON')
    string(name: 'BRANCH_NAME', description: 'Git branch name')
  }

  environment {
    NODE_OPTIONS = '--max-old-space-size=4096'
  }

  stages {
    stage('Setup') {
      steps {
        checkout scm
        sh "git checkout -b ${params.BRANCH_NAME} || git checkout ${params.BRANCH_NAME}"
        sh 'npm ci'
      }
    }

    stage('Apply Generated Code') {
      steps {
        script {
          def code = readJSON text: params.GENERATED_CODE

          // Write all generated files
          code.files.each { file ->
            writeFile file: file.path, text: file.content
          }

          // Write test files
          code.tests.each { test ->
            writeFile file: test.path, text: test.content
          }

          // Write E2E tests
          code.e2e_tests.each { e2e ->
            writeFile file: e2e.path, text: e2e.content
          }
        }
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('TypeScript Check') {
      steps {
        sh 'npx tsc --noEmit'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'npm run test:unit -- --coverage'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('E2E Tests') {
      steps {
        sh 'npm run test:e2e'
      }
    }

    stage('Commit Changes') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        sh """
          git config user.email "jenkins@auto-pipeline.com"
          git config user.name "Jenkins Auto Pipeline"
          git add .
          git commit -m "Auto: Task #${params.TASK_ID} - Claude generated code" || echo "No changes to commit"
          git push origin ${params.BRANCH_NAME}
        """
      }
    }
  }

  post {
    always {
      junit testResults: '**/test-results/**/*.xml', allowEmptyResults: true
      publishHTML([
        reportDir: 'coverage',
        reportFiles: 'index.html',
        reportName: 'Code Coverage'
      ])
    }
    success {
      echo "✅ All tests passed!"
    }
    failure {
      echo "❌ Tests failed - will retry with Claude"
    }
  }
}
```

---

## Step 8: Test the Complete Pipeline

### Create a Test Task in OpenProject:

**Subject:** `[AUTO] Test Feature - Hello World`

**Description:**
```markdown
## Feature Requirements
Create a simple "Hello World" page that displays a greeting.

## Technical Requirements
- Create Next.js page at /hello
- Display "Hello World" message
- Add basic styling

## Acceptance Criteria
- [ ] Page renders at /hello
- [ ] Shows "Hello World" text
- [ ] Text is centered and styled

---

### AUTOMATION METADATA

SPEC_FILE: /specs/features/hello-world.yml

GOOD_EXAMPLES: /src/app/page.tsx

TARGET_FILES: /src/app/hello/page.tsx

---

## Testing Instructions
Navigate to /hello and verify text displays correctly
```

### Create the Spec File:

In your repo, create `/specs/features/hello-world.yml`:

```yaml
feature: Hello World Page
module: test
priority: low
complexity: low

requirements:
  - Display "Hello World" message
  - Center the text
  - Use teal color scheme

acceptance_criteria:
  - Page renders at /hello route
  - Text is visible and centered
  - Matches site design system

tests_required:
  unit:
    - Component renders correctly
  e2e:
    - Page loads successfully
    - Text is visible

good_examples:
  - /src/app/page.tsx
```

### Trigger the Pipeline:

1. Move the task to **"In Progress"** status
2. Watch n8n Executions tab - workflow should trigger
3. Watch Jenkins - job should start
4. Check OpenProject - comment should be posted with results

---

## Step 9: Monitor and Debug

### n8n Executions:
- Click **Executions** in sidebar
- Find your workflow execution
- Click to see each node's input/output
- Red nodes = errors (click to see details)

### Jenkins Logs:
- Go to Jenkins → Job → Build History
- Click build number → Console Output
- Look for errors in red

### OpenProject Comments:
- All results are posted back to task
- Success: Status changes to "Ready for Review"
- Failure: Error logs posted, status stays "In Progress"

---

## Step 10: Environment Variables Summary

Copy this to your `.env` file for n8n:

```bash
# GitHub
GITHUB_OWNER=your-username
GITHUB_REPO=rawgle-frontend

# Jenkins
JENKINS_URL=http://jenkins:8080

# OpenProject
OPENPROJECT_URL=https://openproject.example.com
OPENPROJECT_STATUS_READY_FOR_REVIEW=7
OPENPROJECT_STATUS_FAILED=8

# Vercel (optional)
VERCEL_PROJECT_ID=prj_xxxxx
```

---

## Troubleshooting

### Webhook not triggering:
- Check OpenProject webhook is enabled
- Verify n8n workflow is activated
- Check n8n webhook URL is accessible
- Test with: `curl -X POST http://n8n:5678/webhook-test/openproject-task-update`

### Claude API errors:
- Verify API key is correct
- Check rate limits at https://console.anthropic.com
- Ensure model name is correct: `claude-sonnet-4-20250514`

### Jenkins not starting:
- Check Jenkins URL is correct
- Verify Jenkins credentials
- Ensure pipeline job exists with correct name

### Code not being committed:
- Verify GitHub credentials have write access
- Check git config in Jenkins
- Ensure branch doesn't already exist

---

## Next Steps

1. Set up all credentials (takes 10-15 minutes)
2. Import workflow to n8n
3. Create spec file examples
4. Test with simple task
5. Iterate and improve prompts
6. Add more good examples to repo
7. Create more sophisticated specs

All documentation stays in OpenProject tasks - perfect! 🎉
