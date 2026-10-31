# Last full review

A full review's lanes look hardest at what changed since the last full review closed: the last commit that raised the count below.

```bash
git log -1 --format=%H -G'^Full reviews closed: [1-9]' -- .claude/skills/repo-review/last-full-review.md
```

- **Only a full review's close-out changes the count** (repo-review, step 7): it adds one, in the same commit as the review's fixes. Change and targeted reviews never touch this file. decisions.md isn't used for this, as every mode edits it.
- **While the count is 0,** the command prints nothing, and every lane gives its whole area the full pass.
- **No hash or date is written here:** an amend would leave a written hash pointing nowhere (the command still finds an amended commit), and dates belong in the project skill's history.md. Rewording the rest of this file doesn't move the start, as only the count line is matched.

Full reviews closed: 1
