# 🔐 n8n Credential Library

## All Available Credentials from Your .env Files

### 1. Portainer API ✅ (Already Have Token)
**Type:** HTTP Header Auth
```
Header Name: X-API-Key
Header Value: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=
```
**Use for:** Docker container monitoring, Watchtower workflows

---

### 2. Supabase
**Type:** HTTP Header Auth
```
Header Name: apikey
Header Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5a3BzbHlocnVwYWJsZHJyem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MzUyNTcsImV4cCI6MjA2NDMxMTI1N30.pTO2FudSyvsa4LizQCC7xpI64CN5D86MFCBz5LFu_6k
```
**Base URL:** `https://jykpslyhrupabldrrzmj.supabase.co`
**Use for:** Database queries, auth workflows

---

### 3. Rawgle Generic API
**Type:** HTTP Header Auth
```
Header Name: Authorization
Header Value: Bearer supersecret123
```
**Base URL:** `https://rawgle.com/api`
**Use for:** Rawgle API calls

---

## 🚀 Quick Import Options

### Option 1: Run Import Script (Automated)
```bash
cd /Users/mattwright/pandora/rawgle-frontend
./scripts/import-n8n-credentials.sh
```

### Option 2: Manual Import (Reliable)

For each credential:

1. **Open n8n:** http://10.90.10.6:5678
2. **Click:** Credentials (left sidebar) → Add Credential
3. **Select:** HTTP Header Auth
4. **Fill in** the details from above
5. **Save**

---

## 📋 Credentials You Might Add Later

These are in your `.env.example` but not configured yet:

### Cloudflare
```
CF_ACCOUNT_ID: your-cloudflare-account-id
CF_API_TOKEN: your-cloudflare-api-token
```

### OpenAI
```
OPENAI_API_KEY: sk-xxxxx
```

### AWS
```
AWS_ACCESS_KEY_ID: your-aws-access-key
AWS_SECRET_ACCESS_KEY: your-aws-secret-key
AWS_REGION: us-east-1
```

### Stripe
```
STRIPE_SECRET_KEY: sk_live_xxxxx
STRIPE_WEBHOOK_SECRET: whsec_xxxxx
```

### Resend (Email)
```
RESEND_API_KEY: re_xxxxx
```

### Mapbox
```
MAPBOX_TOKEN: your-mapbox-token
```

---

## 🎯 How to Use Credentials in n8n Workflows

### HTTP Request Node
1. Add "HTTP Request" node
2. Set Authentication: **Predefined Credential Type**
3. Select: **HTTP Header Auth**
4. Choose credential from dropdown

### Example: Query Supabase
```
Method: GET
URL: https://jykpslyhrupabldrrzmj.supabase.co/rest/v1/your_table
Authentication: Supabase (from credential library)
```

### Example: Call Rawgle API
```
Method: POST
URL: https://rawgle.com/api/endpoint
Authentication: Rawgle API Key (from credential library)
Body: { "data": "value" }
```

---

## 🔒 Security Best Practices

✅ **Do:**
- Store all API keys in n8n credentials (encrypted)
- Use environment-specific credentials (dev vs prod)
- Rotate keys periodically
- Use HTTP Header Auth for API tokens

❌ **Don't:**
- Hardcode credentials in workflow nodes
- Share credential IDs publicly
- Use production credentials in test workflows
- Commit credentials to git

---

## 📊 Credential Usage Tracking

| Credential | Used By | Status |
|------------|---------|--------|
| Portainer API | Watchtower workflow | ✅ Active |
| Supabase | - | 📦 Ready |
| Rawgle API | - | 📦 Ready |

---

## 🧪 Test Credentials

### Test Portainer
```bash
curl -H "X-API-Key: ptr_bZy0cA8erGyLH79pGn4s2xp4lStmwjXCgKVps8IiQ7A=" \
  http://172.17.0.2:9000/api/endpoints/3/docker/containers/json
```

### Test Supabase
```bash
curl -H "apikey: eyJhbGci..." \
  https://jykpslyhrupabldrrzmj.supabase.co/rest/v1/
```

### Test in n8n
1. Create new workflow
2. Add HTTP Request node
3. Select credential
4. Click "Execute Node"
5. Should return data (not 401/403)

---

## 🎯 Next Steps

- [ ] Import Portainer API credential
- [ ] Import Supabase credential
- [ ] Import Rawgle API credential
- [ ] Test each credential in n8n
- [ ] Assign to Watchtower workflow
- [ ] Activate workflow

---

**All your credentials in one place, ready to use in any n8n workflow!** 🚀
