# GitHub Username/Org Rename - Impact Analysis

## 🎯 Executive Summary

Renaming your GitHub username from `beyondpandora` or `tenshimatt` to a new name will break **13 specific locations** in your codebase and infrastructure. GitHub **only redirects git clone URLs**, not API endpoints, Pages URLs, or hardcoded references.

**Critical:** Your **n8n automation pipeline** is properly configured with environment variables and **will NOT break** if you update the env vars.

---

## ✅ What GitHub DOES Redirect (Safe)

### 1. Git Clone URLs
```bash
# These will continue to work:
git clone https://github.com/OLD-USERNAME/rawgle-frontend.git
git push origin master
```

**Why:** GitHub maintains permanent redirects for repository URLs

**Action Required:** ✅ None - Works automatically

---

### 2. Repository Web URLs
```
https://github.com/OLD-USERNAME/rawgle-frontend
↓ (redirects to)
https://github.com/NEW-USERNAME/rawgle-frontend
```

**Why:** GitHub redirects repo web pages

**Action Required:** ✅ None - Works automatically

---

## 🚨 What GitHub DOES NOT Redirect (Will Break)

### 1. GitHub API Endpoints ❌

```bash
# BREAKS - Returns 404
https://api.github.com/repos/beyondpandora/rawgle-frontend
https://api.github.com/repos/tenshimatt/rawgle-frontend

# Must update to:
https://api.github.com/repos/NEW-USERNAME/rawgle-frontend
```

**Where Used in Your Stack:**
- ✅ **n8n workflow** (Nodes 005, 007) - Uses `GITHUB_OWNER` env var
- CI/CD pipelines
- GitHub Actions workflows
- Status badges
- Automated scripts

**Impact:** API calls will fail with 404 errors

**Fix Required:** Update environment variables (detailed below)

---

### 2. GitHub Pages URLs ❌

```bash
# BREAKS - No redirect
https://beyondpandora.github.io/rawgle-frontend
https://tenshimatt.github.io/rawgle-frontend

# Must update to:
https://NEW-USERNAME.github.io/rawgle-frontend
```

**Where Used:**
- Demo site links
- Documentation
- README badges

**Impact:** Links return 404

**Fix Required:** Update all hardcoded URLs

---

### 3. Profile/Organization URLs ❌

```bash
# BREAKS - No redirect
https://github.com/beyondpandora
https://github.com/tenshimatt

# Must update to:
https://github.com/NEW-USERNAME
```

**Where Used:**
- Author attribution
- Team pages
- External links

**Impact:** Profile links return 404

**Fix Required:** Update all references

---

### 4. Raw Content URLs ❌

```bash
# BREAKS - No redirect
https://raw.githubusercontent.com/tenshimatt/rawgle-frontend/master/README.md

# Must update to:
https://raw.githubusercontent.com/NEW-USERNAME/rawgle-frontend/master/README.md
```

**Where Used:**
- Direct file links in documentation
- External references
- Badge URLs

**Impact:** File access returns 404

**Fix Required:** Update all raw.githubusercontent.com links

---

## 📋 Your Codebase - Breaking Points Identified

### Files Requiring Updates:

#### 1. **Git Remote URL** (Auto-redirects, but update recommended)
**File:** `.git/config`
```ini
[remote "origin"]
    url = https://github.com/tenshimatt/rawgle-frontend.git
```

**Action:** Update to new username
```bash
git remote set-url origin https://github.com/NEW-USERNAME/rawgle-frontend.git
```

---

#### 2. **Documentation Files** (13 files)

| File | Line | Reference |
|------|------|-----------|
| `README.md` | 70, 605 | Clone URL, Issues link |
| `DEPLOYMENT_COMPLETE.md` | 73 | Remote URL |
| `DEPLOYMENT_AND_INFRASTRUCTURE.md` | 396 | Projects URL |
| `DEPLOYMENT_SUMMARY.md` | 180 | Repo link |
| `IMMEDIATE_ACTION_PLAN.md` | 289 | Repository reference |
| `QUICK_START_VERCEL.md` | 18, 36, 50 | Vercel URLs (beyondpandora) |
| `VERCEL_STRIPE_SETUP.md` | 45, 64, 110, 115, 134, 186, 191 | Webhook URLs |
| `scripts/setup-automation.sh` | 90 | Clone URL |
| `scripts/create-portainer-token.sh` | 12 | Portainer domain |
| `setup-stripe-webhook.sh` | 11 | Vercel URL |
| `docs/CONTAINER_MAINTENANCE.md` | 29 | n8n webhook URL |
| `docs/PIPELINE_COMPLETE.md` | 35 | Repository URL |
| `docs/AUTOMATION_SETUP.md` | 446 | Repository URL |

**Action:** Find and replace all instances:
```bash
# Find all references
grep -r "beyondpandora\|tenshimatt" --exclude-dir=.git --exclude-dir=node_modules .

# Replace (do this carefully!)
find . -type f \( -name "*.md" -o -name "*.sh" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -exec sed -i '' 's/tenshimatt/NEW-USERNAME/g' {} +

find . -type f \( -name "*.md" -o -name "*.sh" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -exec sed -i '' 's/beyondpandora/NEW-ORG/g' {} +
```

---

#### 3. **Package.json** (Missing repository field)

**File:** `package.json`

**Current:** No repository field defined

**Action:** Add repository field (good practice):
```json
{
  "name": "rawgle-frontend",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/NEW-USERNAME/rawgle-frontend.git"
  },
  "bugs": {
    "url": "https://github.com/NEW-USERNAME/rawgle-frontend/issues"
  },
  "homepage": "https://github.com/NEW-USERNAME/rawgle-frontend#readme"
}
```

---

## 🔧 Your Automation Pipeline - Impact Analysis

### ✅ n8n Workflow (SAFE - Uses Environment Variables)

**File:** `n8n-auto-testing-workflow.json`

**Current Configuration:**
- Node 005: `https://api.github.com/repos/{{$env.GITHUB_OWNER}}/{{$env.GITHUB_REPO}}/contents/{{$json.specFile}}`
- Node 007: `https://api.github.com/repos/{{$env.GITHUB_OWNER}}/{{$env.GITHUB_REPO}}/contents/examples`

**Impact:** ✅ **NO BREAKING CHANGES** if you update env vars

**Action Required:**
1. Update n8n environment variable:
```bash
GITHUB_OWNER=NEW-USERNAME  # Change from tenshimatt/beyondpandora
GITHUB_REPO=rawgle-frontend  # Keep same
```

2. Restart n8n workflow for changes to take effect

---

### ⚠️ Vercel Deployment URLs

**Current URLs:**
- `rawgle-frontend-pjtwyuzc8-beyondpandora.vercel.app`
- `rawgle-frontend-git-master-beyondpandora.vercel.app`

**Impact:** URLs contain `beyondpandora` - these are Vercel's auto-generated URLs

**Action:**
- Vercel URLs are based on your **Vercel team name**, not GitHub username
- If you rename Vercel team, all deployment URLs will change
- **Recommendation:** Keep Vercel team name stable, or use custom domain

---

### ⚠️ Custom Domains

**Your domains:**
- `portainer.beyondpandora.com`
- `n8n.beyondpandora.com`

**Impact:** These are DNS records, independent of GitHub

**Action:** No GitHub rename impact, but consider consistency

---

## 🛠️ Pre-Rename Checklist

Before renaming your GitHub username, complete these steps:

### 1. **Environment Variables** (15 minutes)

Update these in your infrastructure:

#### n8n Environment Variables:
```bash
# Current
GITHUB_OWNER=tenshimatt

# Update to
GITHUB_OWNER=NEW-USERNAME
```

#### Jenkins Environment Variables:
```bash
# Update Jenkins job parameters
GITHUB_OWNER=NEW-USERNAME
```

#### CI/CD Pipelines:
- GitHub Actions workflows
- Docker build scripts
- Deployment scripts

---

### 2. **Find All Hardcoded References** (10 minutes)

Run this search:
```bash
cd /Users/mattwright/pandora/rawgle-frontend

# Find all GitHub username references
grep -r "beyondpandora" --exclude-dir=.git --exclude-dir=node_modules . | tee github-refs-beyondpandora.txt
grep -r "tenshimatt" --exclude-dir=.git --exclude-dir=node_modules . | tee github-refs-tenshimatt.txt

# Review the output
cat github-refs-*.txt
```

---

### 3. **Update Documentation** (20 minutes)

Files to manually update:
- [ ] README.md (clone URL, issues link)
- [ ] DEPLOYMENT_COMPLETE.md
- [ ] DEPLOYMENT_AND_INFRASTRUCTURE.md
- [ ] All files in `docs/`
- [ ] All shell scripts in `scripts/`
- [ ] VERCEL_STRIPE_SETUP.md
- [ ] QUICK_START_VERCEL.md

---

### 4. **Update Configuration Files** (10 minutes)

- [ ] package.json (add repository field)
- [ ] .git/config (update remote URL)
- [ ] GitHub Actions workflows (if any)

---

### 5. **External Services** (15 minutes)

Update these services:
- [ ] Vercel - GitHub integration (reconnect)
- [ ] OpenProject webhooks (if using GitHub webhooks)
- [ ] Status badges in README
- [ ] Any external monitoring services

---

## 🚀 Rename Procedure

### Step 1: Backup Everything
```bash
# Backup your repo
tar -czf rawgle-frontend-backup-$(date +%Y%m%d).tar.gz /Users/mattwright/pandora/rawgle-frontend

# Export n8n workflows
# (Do this from n8n UI: Workflows → Select → Export)

# Document all environment variables
env | grep -E "GITHUB|VERCEL|OPENPROJECT" > env-backup.txt
```

---

### Step 2: Rename on GitHub
1. GitHub → Settings → Account → Change username
2. Confirm the rename
3. GitHub creates redirects for git operations

---

### Step 3: Update Local Repository
```bash
cd /Users/mattwright/pandora/rawgle-frontend

# Update remote URL
git remote set-url origin https://github.com/NEW-USERNAME/rawgle-frontend.git

# Verify
git remote -v

# Test connection
git fetch origin
```

---

### Step 4: Update Documentation (Automated)
```bash
# Replace all instances of old username
find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.json" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/tenshimatt/NEW-USERNAME/g' {} +

# Replace all instances of old org
find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.json" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i '' 's/beyondpandora/NEW-ORG/g' {} +

# Verify changes
git diff

# Commit
git add -A
git commit -m "Update GitHub username references from tenshimatt to NEW-USERNAME"
git push origin master
```

---

### Step 5: Update n8n Environment Variables
1. Open n8n → Settings → Variables
2. Update:
   - `GITHUB_OWNER=NEW-USERNAME`
3. Go to Workflows → Your workflow
4. Deactivate and reactivate to reload env vars
5. Test webhook trigger

---

### Step 6: Update Vercel Integration
1. Vercel → Project Settings → Git
2. Disconnect GitHub integration
3. Reconnect with new username
4. Redeploy to verify

---

### Step 7: Update External Services
- [ ] OpenProject webhook URLs
- [ ] Jenkins GitHub credentials
- [ ] Status badges (shields.io)
- [ ] Any monitoring/analytics services

---

### Step 8: Test Everything
```bash
# Test git operations
git pull
git push

# Test n8n webhook
# (Move OpenProject task to "In Progress")

# Test Vercel deployment
git commit --allow-empty -m "Test deployment after rename"
git push origin master

# Check Vercel deployment succeeds
```

---

## 📊 Impact Summary Table

| Component | Impact | Auto-Redirect | Manual Update Required |
|-----------|--------|---------------|------------------------|
| Git clone URLs | Low | ✅ Yes | ❌ Recommended but not required |
| GitHub API calls | High | ❌ No | ✅ Yes - Update env vars |
| GitHub Pages | High | ❌ No | ✅ Yes - Update URLs |
| Documentation | Medium | ❌ No | ✅ Yes - Find & replace |
| n8n workflow | Low | N/A | ✅ Yes - Update `GITHUB_OWNER` |
| Vercel | Low | N/A | ⚠️ Reconnect integration |
| package.json | Low | N/A | ✅ Yes - Add repository field |
| External webhooks | Medium | ❌ No | ✅ Yes - Update URLs |

---

## ⚠️ Risk Assessment

### Low Risk (Easily recoverable)
- Git remote URLs (auto-redirects)
- Local development
- Documentation links

### Medium Risk (Requires manual fix)
- n8n environment variables
- Vercel GitHub integration
- External service webhooks

### High Risk (Silent failures)
- API integrations using hardcoded URLs
- GitHub Actions workflows
- External monitoring services

---

## 🎯 Recommendation

### Option 1: Rename Now (Recommended if needed)
**Pros:**
- Clean, consistent branding
- Your n8n workflow is already env-var based (good!)
- Most git operations auto-redirect

**Cons:**
- 13 files need manual updates
- Need to update external integrations
- 1-2 hours of work

**Best For:** Long-term brand consistency

---

### Option 2: Don't Rename (Safest)
**Pros:**
- No breaking changes
- No downtime
- No risk

**Cons:**
- Inconsistent username across services

**Best For:** Stable production systems

---

### Option 3: Gradual Migration
1. Create new GitHub org with desired name
2. Fork repo to new org
3. Run both in parallel
4. Migrate services one at a time
5. Redirect old repo when ready

**Best For:** Critical production systems with zero tolerance for downtime

---

## 🔍 Post-Rename Verification

After renaming, verify these work:

```bash
# 1. Git operations
git fetch origin
git pull
git push

# 2. n8n workflow
# Trigger OpenProject webhook, check execution logs

# 3. Vercel deployment
git commit --allow-empty -m "Test"
git push
# Check Vercel dashboard

# 4. External webhooks
# Test OpenProject → n8n connection
# Test Stripe → Vercel webhook

# 5. Documentation links
# Click through all GitHub links in README
```

---

## 📞 Support Resources

If something breaks after rename:

1. **GitHub redirects working?**
   ```bash
   curl -I https://github.com/OLD-USERNAME/rawgle-frontend
   # Should see 301 redirect
   ```

2. **API calls failing?**
   ```bash
   curl https://api.github.com/repos/NEW-USERNAME/rawgle-frontend
   # Should return repo data, not 404
   ```

3. **n8n not triggering?**
   - Check n8n executions log
   - Verify `GITHUB_OWNER` env var
   - Test webhook manually

4. **Vercel not deploying?**
   - Reconnect GitHub integration
   - Check deployment logs

---

## 💡 Pro Tips

1. **Do it during low-traffic period** - Minimize user impact
2. **Keep old username documented** - For historical reference
3. **Update gradually** - Don't rush, verify each step
4. **Communicate changes** - Let team know about the rename
5. **Monitor for 48 hours** - Watch for silent failures

---

**Last Updated:** $(date)
**Your Current Usernames:** `tenshimatt` (primary), `beyondpandora` (org)
**Files Requiring Manual Update:** 13
**Environment Variables to Update:** 2 (GITHUB_OWNER in n8n + Jenkins)
