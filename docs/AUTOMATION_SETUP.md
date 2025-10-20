# Rawgle Automation & Quality Control Setup

## Infrastructure Overview

**Docker Server**: `10.90.10.6` (alias: `docker-server`)
**SSH Access**: `ssh docker-server`

### Available Services

| Service | Container | Port | URL | Status |
|---------|-----------|------|-----|--------|
| OpenProject | pandora-openproject | 3002 | http://10.90.10.6:3002 | ✅ Running |
| n8n | pandora-n8n | 5678 | http://10.90.10.6:5678 | ✅ Running |
| Jenkins | pandora-jenkins | 3001 | http://10.90.10.6:3001 | ✅ Running |
| GitLab | pandora-gitlab | 3000 | http://10.90.10.6:3000 | ✅ Running |
| SonarQube | pandora-sonarqube | 9000 | http://10.90.10.6:9000 | ✅ Running |
| Selenium Hub | pandora-selenium-hub | 4444 | http://10.90.10.6:4444 | ✅ Running |
| Grafana | pandora-grafana | 3005 | http://10.90.10.6:3005 | ✅ Running |

### Testing Tools Available

- **Selenium Grid**: Browser automation (Chrome + Firefox)
- **Trivy**: Security scanning
- **SonarQube**: Code quality analysis
- **Jenkins**: CI/CD automation
- **GitLab**: Git + CI/CD pipelines
- **Prometheus + Grafana**: Monitoring

---

## Automation Workflow

### Goal: Zero-Bug Deployments

```
┌─────────────────────────────────────────────────────────────┐
│  OpenProject Task: "Build Add Pet Dialog"                  │
│  Status: Backlog → In Progress                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  n8n Webhook Triggered                                      │
│  Reads: /specs/add-pet-dialog.md                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  LLM Generates Code                                         │
│  Creates: /src/components/pets/add-pet-dialog.tsx          │
│  Creates: /tests/add-pet-dialog.test.tsx                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Quality Gates (Automated)                                  │
│  ├─ TypeScript Build (npm run build)                       │
│  ├─ Unit Tests (npm test)                                  │
│  ├─ E2E Tests (Selenium)                                   │
│  ├─ Code Quality (SonarQube)                               │
│  └─ Security Scan (Trivy)                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
          ┌──────┴──────┐
          │             │
     ALL PASS      ANY FAIL
          │             │
          ▼             ▼
  ┌──────────┐   ┌──────────────┐
  │ Create PR│   │ Comment on   │
  │ Auto-    │   │ OpenProject  │
  │ deploy   │   │ Task with    │
  │ to       │   │ Error Report │
  │ Vercel   │   │              │
  └──────────┘   └──────────────┘
```

---

## Configuration Steps

### 1. OpenProject Setup

**URL**: http://10.90.10.6:3002

#### Initial Configuration
```bash
# Access OpenProject
open http://10.90.10.6:3002

# Default credentials (change immediately)
Username: admin
Password: admin
```

#### Create API Token
1. Login → Avatar → My Account → Access tokens
2. Create new token: "n8n-automation"
3. Save token to `.env.local`:
   ```
   OPENPROJECT_API_TOKEN=your_token_here
   OPENPROJECT_URL=http://10.90.10.6:3002
   ```

#### Project Structure
```
Rawgle Project
├── Backlog
├── In Progress
├── Testing
├── Done
└── Blocked
```

#### Task Template
Each task must have:
- **Title**: Feature name
- **Description**: User story
- **Spec File**: Link to `/specs/{task-id}.md`
- **Acceptance Criteria**: Checklist
- **Labels**: frontend, backend, api, test, etc.

---

### 2. n8n Automation Setup

**URL**: http://10.90.10.6:5678
**Credentials**: `admin` / `pandora123`

#### Workflow: "Rawgle Auto-Code Generator"

```javascript
// 1. OpenProject Webhook Trigger
//    Listens for task status changes
{
  "event": "work_package:updated",
  "filter": {
    "status": "In Progress"
  }
}

// 2. Read Spec File from Git
// GET {repo}/specs/{task_id}.md

// 3. Call LLM API (OpenAI / Claude)
{
  "model": "claude-3-opus",
  "system": "You are a senior TypeScript/React developer. Generate production-ready code from specifications.",
  "messages": [{
    "role": "user",
    "content": "Read spec: {spec_content}\n\nGenerate:\n1. Component code\n2. Unit tests\n3. E2E tests\n4. API routes if needed"
  }]
}

// 4. Create Git Branch
// git checkout -b feature/{task-id}

// 5. Write Files
// - Component
// - Tests
// - Documentation

// 6. Run Quality Gates
// - npm run build
// - npm test
// - npm run test:e2e

// 7. If ALL PASS → Create PR
// 8. If ANY FAIL → Comment on task with errors
```

#### n8n Nodes Configuration

1. **Webhook Node**
   - Method: POST
   - Path: /webhook/openproject
   - Authentication: None (internal network)

2. **HTTP Request Node** (Read Spec)
   - URL: `https://raw.githubusercontent.com/tenshimatt/rawgle-frontend/master/specs/{{$json.id}}.md`
   - Method: GET

3. **Code Node** (Call LLM)
   ```javascript
   const response = await fetch('https://api.anthropic.com/v1/messages', {
     method: 'POST',
     headers: {
       'x-api-key': process.env.ANTHROPIC_API_KEY,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'claude-3-opus-20240229',
       max_tokens: 4096,
       messages: [{
         role: 'user',
         content: `Spec:\n${$json.spec}\n\nGenerate production code.`
       }]
     })
   });
   return response.json();
   ```

4. **SSH Node** (Run Tests on Docker Server)
   ```bash
   cd /app/rawgle-frontend
   npm run build && npm test && npm run test:e2e
   ```

5. **If/Else Node** - Check test results

6a. **GitHub Node** (Success) - Create PR

6b. **OpenProject Node** (Failure) - Add comment

---

### 3. Spec File Format

Location: `/specs/{feature-name}.md`

```markdown
# Feature: Add Pet Dialog

## User Story
AS A pet owner
I WANT TO add my pet's profile
SO THAT I can track their health and feeding

## Requirements

### Functional
- [ ] Image upload with preview
- [ ] Breed dropdown (150+ dog breeds, 40+ cat breeds)
- [ ] Species selection with icons
- [ ] Gender radio buttons
- [ ] Birthdate date picker
- [ ] Weight input (lbs)
- [ ] Form validation
- [ ] API integration

### Non-Functional
- [ ] TypeScript strict mode
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Error handling

## API Contract

### POST /api/pets
```json
{
  "name": "string",
  "species": "dog" | "cat",
  "breed": "string",
  "birthdate": "YYYY-MM-DD",
  "weight": number,
  "gender": "male" | "female",
  "image": "base64 string"
}
```

**Response**: 201 Created
```json
{
  "success": true,
  "data": {
    "id": "string",
    "...petData"
  }
}
```

## Component Structure

```typescript
// File: src/components/pets/add-pet-dialog.tsx
export interface AddPetDialogProps {
  onPetAdded: () => void;
}

export function AddPetDialog({ onPetAdded }: AddPetDialogProps) {
  // Implementation
}
```

## Test Cases

### Unit Tests
```typescript
describe('AddPetDialog', () => {
  it('renders all form fields', () => {});
  it('validates required fields', () => {});
  it('uploads and previews image', () => {});
  it('submits form data correctly', () => {});
  it('handles API errors', () => {});
});
```

### E2E Tests (Selenium)
```typescript
test('user can add a new pet', async () => {
  await page.goto('/pets');
  await page.click('[data-testid="add-pet-button"]');
  await page.fill('[name="name"]', 'Buddy');
  await page.selectOption('[name="breed"]', 'Golden Retriever');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('.pet-card')).toContainText('Buddy');
});
```

## Acceptance Criteria

- [ ] Form validates all required fields
- [ ] Image upload works and shows preview
- [ ] Breed dropdown changes based on species
- [ ] Successfully creates pet in database
- [ ] Shows new pet in pets list immediately
- [ ] All tests pass (unit + E2E)
- [ ] TypeScript build succeeds
- [ ] No console errors
- [ ] Accessible via keyboard navigation
- [ ] Works on mobile devices

## Design References

- Use existing design system (persian-green, charcoal colors)
- Follow patterns from EditPetDialog
- Use RadioGroup component for species/gender
- Use shadcn/ui components

## Dependencies

- DOG_BREEDS constant from `/src/lib/constants/breeds.ts`
- CAT_BREEDS constant from `/src/lib/constants/breeds.ts`
- RadioGroup component from `/src/components/ui/radio-group.tsx`
- Icons from `lucide-react`: Dog, Cat, Upload, X

## Notes

- Birthdate replaces age (age calculated from birthdate)
- All field naming must use lowercase (`birthdate` not `birthDate`)
- API expects `birthdate` as YYYY-MM-DD string
- Image stored as base64 string in database
```

---

## 4. Testing Configuration

### Selenium Grid Setup

```yaml
# docker-compose.yml (already deployed)
services:
  selenium-hub:
    image: selenium/hub:latest
    ports:
      - "4444:4444"

  selenium-chrome:
    image: selenium/node-chrome:latest
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub

  selenium-firefox:
    image: selenium/node-firefox:latest
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
```

### E2E Test Configuration

```javascript
// tests/e2e/config.js
module.exports = {
  seleniumHub: 'http://10.90.10.6:4444/wd/hub',
  baseUrl: 'http://localhost:3010',
  browsers: ['chrome', 'firefox'],
  timeout: 30000
};
```

### Test Execution Script

```bash
#!/bin/bash
# scripts/run-quality-gates.sh

set -e  # Exit on any error

echo "🔨 Building application..."
npm run build

echo "✅ Build succeeded"

echo "🧪 Running unit tests..."
npm test

echo "✅ Unit tests passed"

echo "🌐 Running E2E tests..."
npm run test:e2e

echo "✅ E2E tests passed"

echo "🔍 Running SonarQube analysis..."
sonar-scanner \
  -Dsonar.projectKey=rawgle-frontend \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://10.90.10.6:9000 \
  -Dsonar.login=$SONAR_TOKEN

echo "✅ Code quality check passed"

echo "🛡️  Running security scan..."
trivy fs --severity HIGH,CRITICAL .

echo "✅ Security scan passed"

echo "🎉 All quality gates passed!"
```

---

## 5. Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        OPENPROJECT_TOKEN = credentials('openproject-api-token')
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: env.BRANCH_NAME,
                    url: 'https://github.com/tenshimatt/rawgle-frontend.git'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }

        stage('Code Quality') {
            steps {
                sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=rawgle-frontend \
                      -Dsonar.sources=src \
                      -Dsonar.host.url=http://10.90.10.6:9000 \
                      -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy fs --severity HIGH,CRITICAL .'
            }
        }

        stage('Deploy to Vercel') {
            when {
                branch 'master'
            }
            steps {
                sh 'vercel --prod'
            }
        }
    }

    post {
        failure {
            script {
                // Comment on OpenProject task
                sh '''
                    curl -X POST http://10.90.10.6:3002/api/v3/work_packages/${TASK_ID}/activities \
                      -H "Authorization: Bearer ${OPENPROJECT_TOKEN}" \
                      -H "Content-Type: application/json" \
                      -d '{
                        "comment": {
                          "raw": "❌ Build failed: ${BUILD_URL}"
                        }
                      }'
                '''
            }
        }
    }
}
```

---

## Quick Start

### 1. Configure Services

```bash
# Start all services
ssh docker-server "cd /path/to/docker-compose && docker-compose up -d"

# Check status
ssh docker-server "docker ps"
```

### 2. Create First Spec

```bash
cd /Users/mattwright/pandora/rawgle-frontend
mkdir -p specs
cat > specs/example-feature.md << 'EOF'
# Feature: Example Feature
[Use template above]
EOF
```

### 3. Configure n8n Workflow

1. Open http://10.90.10.6:5678
2. Import workflow from `docs/n8n-workflows/auto-code-generator.json`
3. Configure credentials
4. Activate workflow

### 4. Create OpenProject Task

1. Open http://10.90.10.6:3002
2. Create task: "Build Example Feature"
3. Add spec file link
4. Move to "In Progress"
5. Watch automation run! 🚀

---

## Troubleshooting

### n8n Webhook Not Triggering

```bash
# Check n8n logs
ssh docker-server "docker logs -f pandora-n8n"

# Test webhook manually
curl -X POST http://10.90.10.6:5678/webhook/openproject \
  -H "Content-Type: application/json" \
  -d '{"id": "test", "status": "In Progress"}'
```

### Selenium Tests Failing

```bash
# Check Selenium Hub status
open http://10.90.10.6:4444/ui

# Check browser nodes
ssh docker-server "docker logs pandora-selenium-chrome"
ssh docker-server "docker logs pandora-selenium-firefox"
```

### Build Failures

```bash
# SSH into container
ssh docker-server "docker exec -it pandora-jenkins bash"

# Check workspace
cd /var/jenkins_home/workspace/rawgle-frontend
npm run build
```

---

## Next Steps

1. **Configure OpenProject API integration**
2. **Build first n8n workflow**
3. **Create spec templates**
4. **Set up Jenkins pipeline**
5. **Configure SonarQube quality gates**
6. **Write E2E test framework**
7. **Document all workflows**

---

## Monitoring

- **Jenkins**: http://10.90.10.6:3001
- **Grafana**: http://10.90.10.6:3005
- **Dozzle (Logs)**: http://10.90.10.6:8080
- **Selenium Grid**: http://10.90.10.6:4444/ui

---

*Last Updated: 2025-10-20*
*Maintained by: Claude Code Automation*
