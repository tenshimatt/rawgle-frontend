# DevOps Deployment Workflow - Ready to Build

## ✅ Infrastructure Verified

All services running on `v6_pandora-network` (172.18.0.0/16):

| Service | IP Address | Port | Purpose |
|---------|-----------|------|---------|
| **Jenkins** | 172.18.0.21 | 8080 | CI/CD builds |
| **Docker Registry** | 172.18.0.23 | 5000 | Image storage |
| **Nexus** | 172.18.0.17 | 8081 | Artifact repository |
| **Selenium Hub** | 172.18.0.13 | 4444 | Automated testing |
| **n8n** | 172.18.0.5 | 5678 | Workflow orchestration |

## ✅ Test Workflow Created

**Workflow ID:** `ZbLQxDHxhUHvAt6a`
**Name:** "Test Jenkins API"

This workflow verifies Jenkins connectivity from n8n container.

### To Test:
1. Open http://10.90.10.6:5678
2. Open "Test Jenkins API" workflow
3. Click **"Execute Workflow"** button
4. Should return: `{ status: 'success', jenkinsMode: 'NORMAL', jobs: X }`

## 📋 Full DevOps Workflow Design

### Trigger: Git Push Webhook

```
GitLab Push Event
    ↓
[Webhook: gitlab-push] - Receives push notification
    ↓
[Parse Git Data] - Extract: branch, commit hash, author, files changed
    ↓
[Check Branch] - IF: main/master/develop
    ↓
```

### Build Stage

```
[Trigger Jenkins Build]
  POST http://172.18.0.21:8080/job/{job_name}/buildWithParameters
  Body: { COMMIT_HASH: "...", BRANCH: "..." }
    ↓
[Get Build Number] - Parse Jenkins queue response
    ↓
[Wait 5s] - Allow build to start
    ↓
[Poll Build Status] - Loop until complete
  GET http://172.18.0.21:8080/job/{job_name}/{build_num}/api/json
    ↓
[Check Build Result] - IF: result === "SUCCESS"
```

### Test Stage

```
[Trigger Selenium Tests]
  POST http://172.18.0.13:4444/wd/hub/session
  Body: { capabilities: {...} }
    ↓
[Run Test Suite] - Execute Selenium commands
    ↓
[Parse Test Results]
    ↓
[Check Tests] - IF: all tests passed
```

### Deploy Stage

```
[Build Docker Image]
  SSH: docker build -t 172.18.0.23:5000/app:${commit}
    ↓
[Push to Registry]
  SSH: docker push 172.18.0.23:5000/app:${commit}
    ↓
[Update Production]
  SSH: docker service update --image 172.18.0.23:5000/app:${commit}
    ↓
[Verify Deployment]
  GET http://{service}/health
    ↓
[Send Notification]
  Webhook to Slack/Discord/Email
```

## 🔑 Credentials Needed

Before building, you need to provide:

1. **Jenkins API Token**
   - Go to: http://10.90.10.6:3001/user/{your-user}/configure
   - Generate API Token
   - We'll import as credential: `Jenkins API Token`

2. **GitLab Webhook Secret**
   - Generate secure random token
   - Configure in GitLab project → Settings → Webhooks
   - Webhook URL: `http://10.90.10.6:5678/webhook/gitlab-push`

3. **Docker Registry Auth** (if enabled)
   - Username/password for registry

4. **SSH Access** (for docker commands)
   - Already have: `docker-server` SSH key

## 🎯 Next Steps

1. **Provide Credentials:**
   - Jenkins username and API token
   - GitLab webhook secret token
   - Jenkins job name(s) to trigger

2. **I'll Build Workflow:**
   - Import all credentials via API
   - Create full workflow using HTTP Request nodes
   - Test each stage incrementally
   - Activate when verified

3. **Configure GitLab:**
   - Add webhook URL to your GitLab project
   - Test with dummy push

## 📝 Notes

- **All URLs use internal Docker IPs** (172.18.0.x)
- **No app-specific nodes** - only HTTP Request + Function
- **Each stage tested** before moving to next
- **Incremental build** to avoid debugging hell

---

**Ready to proceed?** Provide the credentials and I'll build this step-by-step.
