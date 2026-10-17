---
name: pr-review-checklist
description: Comprehensive pull request review checklist covering code quality, security, testing, and documentation. Use when reviewing PRs or preparing code for review.
---

# PR Review Checklist Skill

## Pre-Review Setup

- [ ] Understand the **purpose** of the PR (read description, linked issues)
- [ ] Check **scope** - is it focused? (single feature/fix)
- [ ] Verify **CI passes** - all checks green
- [ ] Pull branch locally for complex changes

## Code Quality

### General
- [ ] Code follows project style guide (linting passes)
- [ ] No commented-out code or debug statements
- [ ] No `console.log`, `print`, `debugger` in production code
- [ ] Meaningful variable/function names (no `data`, `temp`, `foo`)
- [ ] Functions are small (< 30 lines) and focused
- [ ] No magic numbers/strings - use constants

### Architecture
- [ ] Changes align with existing patterns
- [ ] No inappropriate coupling between modules
- [ ] Dependencies flow in correct direction
- [ ] No circular dependencies introduced
- [ ] Public APIs are intentional and documented

### Error Handling
- [ ] Errors are caught and handled appropriately
- [ ] Error messages are user-friendly (no stack traces to users)
- [ ] Logging at appropriate levels (error/warn/info/debug)
- [ ] Retry logic for transient failures
- [ ] Circuit breakers for external dependencies

## Security

### Input/Output
- [ ] All user inputs validated and sanitized
- [ ] Output encoding for XSS prevention
- [ ] Parameterized queries (no SQL injection)
- [ ] No command injection vulnerabilities
- [ ] File upload validation (type, size, path)

### Authentication/Authorization
- [ ] Auth checks on all protected endpoints
- [ ] Role/permission verification
- [ ] No IDOR (Insecure Direct Object References)
- [ ] Session management secure (httponly, secure, samesite)
- [ ] Password requirements enforced

### Secrets & Configuration
- [ ] No hardcoded secrets, API keys, passwords
- [ ] Environment variables for all config
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets in vault/secret manager

### Dependencies
- [ ] No new critical/high vulnerabilities (`npm audit`, etc.)
- [ ] Dependencies pinned to specific versions
- [ ] License compatibility checked

## Testing

### Coverage
- [ ] Unit tests for new business logic
- [ ] Integration tests for API/database changes
- [ ] E2E tests for critical user flows
- [ ] Edge cases covered (null, empty, boundaries)
- [ ] Error paths tested

### Quality
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests run fast (< 10s unit, < 60s integration)
- [ ] Test names describe behavior (`should_..._when_...`)
- [ ] No test-only code in production
- [ ] Mocks used appropriately (not over-mocked)

### CI/CD
- [ ] Tests run in CI pipeline
- [ ] Coverage thresholds enforced
- [ ] Linting/type checking in CI

## Performance

- [ ] No N+1 query problems
- [ ] Database indexes for new queries
- [ ] Caching strategy for expensive operations
- [ ] Pagination for list endpoints
- [ ] Bundle size impact assessed (frontend)
- [ ] Lazy loading for heavy components

## Documentation

- [ ] README updated if setup/usage changed
- [ ] API docs updated (OpenAPI/Swagger)
- [ ] Code comments for complex logic
- [ ] ADR created for architectural decisions
- [ ] Changelog entry prepared
- [ ] Migration guide for breaking changes

## Git/GitHub

### Commit History
- [ ] Conventional commit messages
- [ ] Atomic commits (one logical change per commit)
- [ ] No fixup/squash commits in history
- [ ] Meaningful commit messages explaining WHY

### PR Metadata
- [ ] Clear title (conventional format)
- [ ] Description explains WHAT and WHY
- [ ] Linked issues (`Fixes #123`, `Relates to #456`)
- [ ] Labels applied (feature, bug, breaking, etc.)
- [ ] Reviewers assigned
- [ ] Milestone set (if applicable)

### Branch
- [ ] Branch named correctly (`feature/...`, `fix/...`, `hotfix/...`)
- [ ] Branch up to date with base branch
- [ ] No merge commits from base branch

## Review Process

### As Reviewer
1. **First pass**: High-level - understand changes, check CI
2. **Second pass**: Detailed - code logic, security, tests
3. **Third pass**: Polish - style, naming, comments
4. **Feedback**: Categorize as 🔴 Must Fix, 🟡 Should Fix, 💡 Suggestion
5. **Approve** only when 🔴 issues resolved

### As Author
1. **Self-review** before requesting review
2. **Respond promptly** to feedback
3. **Address all 🔴/🟡** before re-requesting review
4. **Explain disagreements** with reasoning
5. **Squash/fixup** commits before merge

## Merge Criteria

- [ ] All 🔴 Must Fix resolved
- [ ] All 🟡 Should Fix resolved or explicitly accepted
- [ ] All CI checks passing
- [ ] Required approvals obtained
- [ ] No merge conflicts
- [ ] Branch protection rules satisfied

## Post-Merge

- [ ] Delete branch (auto or manual)
- [ ] Verify deployment (if applicable)
- [ ] Close linked issues
- [ ] Update project board
- [ ] Communicate changes to stakeholders

## Quick Reference Card

| Category | Must Have | Nice to Have |
|----------|-----------|--------------|
| **Security** | AuthZ, Input validation, No secrets | CSP, Rate limiting, Audit logging |
| **Tests** | Unit for new logic, Integration for APIs | E2E for critical paths, Mutation testing |
| **Docs** | Code comments, API docs updated | ADR, Architecture diagrams |
| **Performance** | No N+1, Pagination | Caching, Bundle analysis |
| **Process** | Conventional commits, CI green | Linear history, Signed commits |

## GitHub Review Commands

```bash
# View PR with checks
gh pr view 123 --json title,body,reviewDecision,statusCheckRollup

# Add review comment
gh pr comment 123 --body "🔴 **Must Fix**: src/auth.ts:45 - SQL injection risk"

# Approve
gh pr review 123 --approve --body "LGTM"

# Request changes
gh pr review 123 --request-changes --body "See comments"

# Merge (squash)
gh pr merge 123 --squash --delete-branch
```

## When to Use

- Reviewing any pull request
- Preparing your own PR for review
- Onboarding new reviewers
- Establishing team review standards
- Auditing code quality