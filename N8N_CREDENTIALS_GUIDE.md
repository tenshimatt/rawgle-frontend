# 🔐 n8n Credentials Setup Guide

## Current Credentials Needed

The Watchtower monitoring workflow only needs **ONE credential**:

### Portainer API Access

**Credential Type:** HTTP Header Auth
**Name:** `Portainer API`
**Configuration:**
```
Header Name: X-API-Key
Header Value: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=
```

**Used by these nodes:**
- Pre-Update Container Status
- Post-Update Container Status

---

## 🎯 How to Add This Credential in n8n

### Method 1: Manual Entry (Recommended)

1. **Open n8n:** http://10.90.10.6:5678
2. **Go to Credentials** (left sidebar)
3. **Click "Add Credential"**
4. **Select:** "HTTP Header Auth"
5. **Fill in:**
   - **Credential Name:** `Portainer API`
   - **Header Name:** `X-API-Key`
   - **Header Value:** `ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=`
6. **Click "Save"**

### Method 2: During Workflow Import

1. **Import the workflow** (as normal)
2. **n8n will warn** about missing credentials
3. **Click on any red warning** icon
4. **Create credential** (same steps as Method 1)
5. **Apply to all nodes** using the same credential

---

## 🔄 Update Workflow URLs

After importing, you need to update **2 nodes** with the correct Portainer URL:

### Node 1: "Pre-Update Container Status"
**Change URL from:**
```
http://10.90.10.6:9000/api/endpoints/3/docker/containers/json
```

**To:**
```
http://172.17.0.2:9000/api/endpoints/3/docker/containers/json
```

### Node 2: "Post-Update Container Status"
**Change URL from:**
```
http://10.90.10.6:9000/api/endpoints/3/docker/containers/json
```

**To:**
```
http://172.17.0.2:9000/api/endpoints/3/docker/containers/json
```

**Why 172.17.0.2?**
This is Portainer's internal Docker IP that n8n can reach (we connected the networks).

---

## 📋 Other Credentials Available (For Future Workflows)

Your `.env` files contain these credentials that can be added to n8n for other workflows:

### Supabase
```
URL: https://jykpslyhrupabldrrzmj.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Generic API
```
API Key: supersecret123
```

### Rawgle API
```
URL: https://rawgle.com/api
App URL: http://localhost:3002
```

These aren't needed for the Watchtower workflow, but can be added later for other automation workflows.

---

## ✅ Complete Setup Checklist

- [ ] Create "Portainer API" credential in n8n
- [ ] Import workflow from `/docker/watchtower/n8n-workflow.json`
- [ ] Update "Pre-Update Container Status" URL to `172.17.0.2:9000`
- [ ] Update "Post-Update Container Status" URL to `172.17.0.2:9000`
- [ ] Assign "Portainer API" credential to both HTTP nodes
- [ ] Activate workflow (toggle switch)
- [ ] Test by clicking "Execute" on "Pre-Update Container Status" node

---

## 🧪 Test the Credential

After setting up, test it works:

```bash
# From command line (should return container data)
curl -H "X-API-Key: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=" \
  http://172.17.0.2:9000/api/endpoints/3/docker/containers/json | jq '.[].Names'
```

Or in n8n:
1. Click "Pre-Update Container Status" node
2. Click "Execute Node"
3. Should see JSON with all your containers

---

## 🔒 Security Notes

- ✅ Portainer API token is stored encrypted in n8n
- ✅ Token only has access to Portainer API (Docker containers)
- ✅ n8n credentials are password-protected (admin/pandora123)
- ⚠️ Token doesn't expire - consider rotating periodically

---

**That's it! Just ONE credential needed for the Watchtower workflow.** 🚀
