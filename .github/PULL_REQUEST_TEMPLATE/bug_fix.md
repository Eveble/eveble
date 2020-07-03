First, choose a meaningful and short title and mention context for example: `[FOO-123] Fixed component handling`.

### Summary

What is the problem you fixed?

### What is the current _bug_ behavior?

What actually happens?

### What is the expected _correct_ behavior?

What you should see instead?

### Steps to reproduce

How can you reproduce the issue?

### Relevant data

- [If you fixed a bug] From which branch name bug occurred and commit hash: branch/hash
- [If you fixed a bug for new scenario] Provide the scenario file --- no matter how simple the scenario is.

### Logs and outputs

[If relevant] Provide log files or console output with error/warning message.

Please, use code blocks (backticks) and if it is much text, encapsulate the text in `<details>` tag:

```
A short
code block
```

<details>
<summary>A long code block...</summary>
<pre>
Line 1 of log file xy`
Line 2 of log file xy`
</pre>
</details>

### Starting point

[If you know it] Starting point in the code for handling the issue (e.g. class name) --> URL to code line in Github is also useful.

---

## Review Checklist

### Basics

- [ ] PR information has been filled
- [ ] PR has been assigned
- [ ] PR uses appropriate labels (`fix`)
- [ ] PR has a all necessary bug-description fields filled
- [ ] PR is peer reviewed <sup>**optional**</sup>
- [ ] Commits contain a meaningful commit messages and fallow syntax of [Conventional Commits](http://www.conventionalcommits.org/)
- [ ] On dependency change: `yarn.lock` file is updated and committed
- [ ] `CHANGELOG.md` and references to project's version are unchanged(let [semantic-release](https://github.com/semantic-release/semantic-release) do the magic)

### Code Quality

- [ ] Code is properly typed with TypeScript
- [ ] Code `builds`(`yarn build`)
- [ ] Code is `formatted`(`yarn test:format`)
- [ ] Code is `linted`(`yarn test:lint`)
- [ ] Code is unit `tested`(`yarn test:unit`)
- [ ] Code is integration `tested`(`yarn test:integration`)

### Testing

- [ ] New fix is covered by unit tests
- [ ] New fix is covered by integration tests
- [ ] All existing tests are still up-to-date

### After Review

- [ ] Merge the PR
- [ ] Delete the source branch
- [ ] Move the ticket to `done` <sup>**optional**</sup>
