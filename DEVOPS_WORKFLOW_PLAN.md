# DevOps Automation Workflow Plan

## Available Infrastructure

**IMPORTANT:** n8n is in Docker, use container IPs on `v6_pandora-network`

| Service | Container | Pandora Network IP | Internal Port | n8n URL |
|---------|-----------|-------------------|---------------|---------|
| Jenkins | pandora-jenkins | 172.18.0.21 | 8080 | http://172.18.0.21:8080 |
| Docker Registry | pandora-docker-registry | 172.18.0.23 | 5000 | http://172.18.0.23:5000 |
| Nexus | pandora-nexus | 172.18.0.17 | 8081 | http://172.18.0.17:8081 |
| Selenium Hub | pandora-selenium-hub | 172.18.0.13 | 4444 | http://172.18.0.13:4444 |
| n8n | pandora-n8n | 172.18.0.5 | 5678 | (local) |

## Workflow Strategy: HTTP Request Nodes Only

**Why:** Avoid issues with outdated/missing n8n app nodes

### Node Types We'll Use:
1. **Webhook Trigger** - Proven working
2. **HTTP Request** - Proven working (Portainer)
3. **Function** - Proven working (data transformation)
4. **IF** - Conditional logic
5. **Respond to Webhook** - Return status

## Proposed Workflow

```
Git Push (GitLab)
    ↓
[Webhook Trigger] - Receives GitLab push event
    ↓
[Parse Git Data] - Extract branch, commit, author
    ↓
[Trigger Jenkins Build] - HTTP POST to Jenkins API
    ↓
[Wait for Build] - Poll Jenkins build status
    ↓
[Check Build Result] - IF node: success/failure
    ↓
├─ SUCCESS → [Run Tests] - Trigger Selenium tests
│      ↓
│   [Check Tests] - IF node: pass/fail
│      ↓
│   ├─ PASS → [Push to Registry] - Docker push
│   │     ↓
│   │  [Deploy] - Update production containers
│   │
│   └─ FAIL → [Notify Failure]
│
└─ FAILURE → [Notify Build Failed]
```

## API Endpoints to Configure

### 1. Jenkins API
```bash
# Trigger build
POST http://10.90.10.6:3001/job/{job_name}/build
Header: Authorization: Basic {base64(user:token)}

# Get build status
GET http://10.90.10.6:3001/job/{job_name}/{build_number}/api/json
```

### 2. Docker Registry API
```bash
# Push image (via docker command on server)
ssh docker-server "docker push 10.90.10.6:{port}/image:tag"

# List images
GET http://10.90.10.6:{port}/v2/_catalog
```

### 3. GitLab Webhook
```bash
# Configure in GitLab project settings
Webhook URL: http://10.90.10.6:5678/webhook/gitlab-push
Secret Token: {generate secure token}
Events: Push events, Merge request events
```

## Next Steps

1. ✅ Document infrastructure (DONE)
2. ⏳ Verify Jenkins credentials/token
3. ⏳ Check Docker Registry port and auth
4. ⏳ Test each API endpoint individually
5. ⏳ Build workflow incrementally
6. ⏳ Test each node before adding next

## Credentials Needed

- [ ] Jenkins API token
- [ ] GitLab webhook secret
- [ ] Docker Registry credentials (if auth enabled)
- [ ] Nexus credentials (if using for artifacts)
