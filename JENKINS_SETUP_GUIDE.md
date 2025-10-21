# Jenkins Setup Guide - Security & Configuration

## Current Issues (from your screenshot)

1. ⚠️ **Security Not Configured** - Jenkins is unsecured (anyone can access)
2. ⚠️ **Jenkins URL Empty** - Required for webhooks, notifications, BUILD_URL
3. ⚠️ **Building on Built-in Node** - Security risk, should use agents

## Step 1: Configure Jenkins URL

1. Go to: **Manage Jenkins** → **System**
2. Find: **Jenkins Location**
3. Set **Jenkins URL** to: `http://10.90.10.6:3001/`
4. Set **System Admin e-mail address** to: `admin@pandora.local`
5. Click **Save**

## Step 2: Setup Security (IMPORTANT!)

### Enable Authentication

1. Go to: **Manage Jenkins** → **Security** → **Configure Global Security**

2. **Security Realm** (who can log in):
   - Select: **Jenkins' own user database**
   - ✅ Check: **Allow users to sign up**
   - Click **Save**

3. **Create Admin User:**
   - Top right → **Sign up**
   - Username: `admin`
   - Password: `pandora123` (or your preference)
   - Full name: `Jenkins Admin`
   - Email: `admin@pandora.local`
   - Click **Sign up**

4. **Configure Authorization** (who can do what):
   - Go back to: **Manage Jenkins** → **Security**
   - **Authorization** section:
   - Select: **Matrix-based security** or **Project-based Matrix Authorization Strategy**

   **For Matrix-based security:**
   - Add user: `admin`
   - Check **ALL** permissions for admin
   - For **Anonymous**: Check only **Read** (or nothing for full lockdown)
   - Click **Save**

### Generate API Token for n8n

1. Top right → Click **admin** → **Configure**
2. Scroll to **API Token** section
3. Click **Add new Token**
4. Token name: `n8n-automation`
5. Click **Generate**
6. **COPY THE TOKEN IMMEDIATELY** (only shown once)
7. Save it here: `________________`

## Step 3: Fix Built-in Node Warning (Optional but Recommended)

### Option A: Disable Built-in Node Executors
1. **Manage Jenkins** → **Nodes** → **Built-In Node**
2. Click **Configure**
3. Set **Number of executors** to: `0`
4. Click **Save**

### Option B: Set Up Docker Agent (Better)
Since you have `pandora-gitlab-runner`, you can use it as a Jenkins agent:

1. **Manage Jenkins** → **Nodes** → **New Node**
2. Node name: `docker-agent`
3. Select: **Permanent Agent**
4. Set:
   - Remote root directory: `/tmp/jenkins`
   - Labels: `docker linux`
   - Usage: **Use this node as much as possible**
   - Launch method: **Launch agent via execution of command on controller**
   - Launch command: `docker exec pandora-gitlab-runner /bin/sh`
5. Click **Save**

## Step 4: Create Jenkins Job for n8n Workflow

1. **Dashboard** → **New Item**
2. Item name: `rawgle-frontend-build`
3. Select: **Pipeline**
4. Click **OK**

5. **Configure Pipeline:**

   **General:**
   - ✅ **This project is parameterized**
   - Add String Parameter:
     - Name: `COMMIT_HASH`
     - Default: `main`
   - Add String Parameter:
     - Name: `BRANCH`
     - Default: `main`

   **Build Triggers:**
   - ✅ **Trigger builds remotely (e.g., from scripts)**
   - Authentication Token: `n8n-webhook-token`

   **Pipeline:**
   - Definition: **Pipeline script**
   - Script:
```groovy
pipeline {
    agent any

    parameters {
        string(name: 'COMMIT_HASH', defaultValue: 'main', description: 'Git commit to build')
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Building commit: ${params.COMMIT_HASH}"
                echo "Branch: ${params.BRANCH}"
                // Add your git checkout here
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                // Add your build commands here
                // sh 'npm install'
                // sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test commands here
                // sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                // sh 'docker build -t rawgle-frontend:${params.COMMIT_HASH} .'
            }
        }
    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
```

6. Click **Save**

## Step 5: Credentials for n8n Import

After completing setup, provide these to me:

```
Jenkins Username: admin
Jenkins API Token: [paste token from Step 2]
Jenkins Job Name: rawgle-frontend-build
Jenkins Remote Build Token: n8n-webhook-token
```

## Step 6: Test Jenkins API

After setup, test the API works:

```bash
# Test authentication
curl -u admin:YOUR_API_TOKEN http://172.18.0.21:8080/api/json

# Test triggering build
curl -X POST -u admin:YOUR_API_TOKEN \
  "http://172.18.0.21:8080/job/rawgle-frontend-build/buildWithParameters?BRANCH=main&COMMIT_HASH=abc123&token=n8n-webhook-token"
```

## Security Best Practices Applied

✅ User authentication enabled (Jenkins database)
✅ Authorization configured (admin has full access)
✅ API token for programmatic access
✅ Built-in node disabled/limited
✅ Remote build tokens for webhook security
✅ Jenkins URL configured for proper webhook callbacks

## Next Steps

1. Complete this setup
2. Provide me the credentials
3. I'll test the Jenkins API from n8n
4. Then build the full deployment workflow

---

**Once you've completed this setup, send me the API token and I'll proceed with the workflow build.**
