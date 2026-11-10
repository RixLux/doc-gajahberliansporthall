---
title: Contributing & Git Workflow
description: Contribution guidelines, branching strategies, commit conventions, and pull request procedures.
---

We welcome contributions to the Gajah Berlian Sports Hall platform! Please follow these standards to ensure code quality and seamless team collaboration.

---

## 1. Git Submodule Workflow

Since this repository uses Git submodules for `FE-Gajah-Berlian-Sport-Hall` and `BE-Gajah-Berlian-Sport-Hall`, follow these guidelines:

### Working on a Submodule
```bash
# Enter the submodule directory
cd FE-Gajah-Berlian-Sport-Hall   # or cd BE-Gajah-Berlian-Sport-Hall

# Checkout your feature branch inside the submodule
git checkout -b feature/my-new-feature

# Make your changes, test them, and commit
git add .
git commit -m "feat: add court filter"
git push origin feature/my-new-feature
```

### Updating the Root Workspace Reference
Whenever commits are pushed to a submodule, the root repository must track the new commit SHA:
```bash
cd .. # Back to root
git add FE-Gajah-Berlian-Sport-Hall
git commit -m "chore(submodule): update FE commit pointer"
git push origin main
```

---

## 2. Branching Strategy

| Branch | Purpose |
| :--- | :--- |
| `main` | Production-ready, deployable code |
| `feature/<name>` | New features or functional enhancements |
| `fix/<name>` | Bug fixes and patches |
| `docs/<name>` | Documentation updates |

---

## 3. Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation-only changes
- `refactor:` Code restructuring without changing behavior
- `test:` Adding or updating test cases
- `chore:` Tooling, dependency, or configuration changes

**Example**:
```bash
git commit -m "feat(booking): add 15-minute slot hold countdown timer"
git commit -m "fix(auth): redirect non-admin users to 403 screen on admin route"
```

---

## 4. Pull Request Checklist

Before submitting a Pull Request (PR):
- [ ] Backend tests pass cleanly (`npm test` in `BE-Gajah-Berlian-Sport-Hall`).
- [ ] Frontend builds without errors (`npm run build` in `FE-Gajah-Berlian-Sport-Hall`).
- [ ] Documentation builds without errors (`npm run build` at root).
- [ ] No unhandled TypeScript errors or console warnings.
- [ ] Clear description of what the PR accomplishes and how to test it.
