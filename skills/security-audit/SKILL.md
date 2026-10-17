---
name: security-audit
description: Security vulnerability scanning and secure coding patterns. Use when reviewing code for security issues, auditing dependencies, or implementing security fixes.
---

# Security Audit Skill

## OWASP Top 10 Checklist

### A01: Broken Access Control
- [ ] Authorization checks on every endpoint
- [ ] No IDOR (Insecure Direct Object References)
- [ ] Default deny, explicit allow
- [ ] Role-based access control (RBAC) implemented

### A02: Cryptographic Failures
- [ ] HTTPS/TLS 1.2+ everywhere
- [ ] Sensitive data encrypted at rest
- [ ] Strong algorithms (AES-256, RSA-2048+, bcrypt/argon2)
- [ ] No hardcoded keys/secrets
- [ ] Proper key rotation

### A03: Injection
- [ ] Parameterized queries (no string concatenation)
- [ ] Input validation + output encoding
- [ ] ORM/Query builder usage
- [ ] Command injection prevention

### A04: Insecure Design
- [ ] Threat modeling done
- [ ] Security requirements defined
- [ ] Secure defaults
- [ ] Defense in depth

### A05: Security Misconfiguration
- [ ] Debug disabled in production
- [ ] Default credentials changed
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Unnecessary features disabled

### A06: Vulnerable Components
- [ ] Dependency scanning automated
- [ ] Regular updates
- [ ] SBOM (Software Bill of Materials)
- [ ] License compliance

### A07: Auth Failures
- [ ] MFA support
- [ ] Brute force protection
- [ ] Secure password reset
- [ ] Session management (secure, httponly, samesite)

### A08: Software Integrity Failures
- [ ] CI/CD pipeline integrity
- [ ] Signed releases
- [ ] Dependency verification
- [ ] Build reproducibility

### A09: Logging Failures
- [ ] Security events logged
- [ ] No sensitive data in logs
- [ ] Alerting on anomalies
- [ ] Log integrity protection

### A10: SSRF
- [ ] URL validation/sanitization
- [ ] Allowlist for outbound requests
- [ ] No raw user input in fetch/curl

## Code Patterns to Flag

### Secrets Detection
```regex
# API Keys
(api[_-]?key|apikey)["'\s:=]+[a-zA-Z0-9_-]{20,}

# AWS
(AKIA|ASIA)[A-Z0-9]{16}

# Generic
(password|secret|token|key)["'\s:=]+[^\s"']{8,}
```

### Dangerous Functions
```javascript
// JavaScript/TypeScript
eval(), Function(), setTimeout(string), setInterval(string)
child_process.exec(), execSync() with user input
fs.readFileSync(userInput) // path traversal

// Python
eval(), exec(), pickle.load()
subprocess.call(shell=True)
os.system()

// Go
exec.Command with user input
template.Execute with user data
```

### SQL Injection
```sql
-- BAD
"SELECT * FROM users WHERE id = " + userId

-- GOOD
"SELECT * FROM users WHERE id = ?", [userId]
```

## Automated Scanning Tools

```bash
# Node.js
npm audit
npm audit fix
npx audit-ci --config audit-ci.json

# Python
pip-audit
safety check

# Go
govulncheck ./...

# Rust
cargo audit

# Docker
docker scout cves <image>

# Generic
trivy fs .
trivy image <image>
```

## Secure Coding Patterns

### Input Validation
```typescript
// Zod schema validation
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
  name: z.string().min(1).max(100)
});

// Always validate at boundaries
app.post("/users", validateBody(userSchema), handler);
```

### Output Encoding
```typescript
// HTML context
escapeHtml(userInput)

// JavaScript context
escapeJs(userInput)

// SQL - use parameterized queries
// Shell - avoid, use APIs
```

### Secure Headers (Express/NestJS)
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));
```

## Dependency Audit Workflow

```bash
# 1. Check for vulnerabilities
npm audit --json > audit-report.json

# 2. Review critical/high
jq '.vulnerabilities | to_entries[] | select(.value.severity == "critical" or .value.severity == "high")' audit-report.json

# 3. Update dependencies
npm update --save

# 4. For breaking changes, assess risk
npm outdated

# 5. Document exceptions in audit-ci.json
```

## When to Use

- Code review for security issues
- Dependency vulnerability scanning
- Implementing auth/authorization
- Handling sensitive data
- Security incident response
- Compliance audits (SOC2, ISO27001)