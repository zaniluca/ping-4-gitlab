# Contributing to Ping for Gitlab

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## Contribute to the project

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. Make sure your code is clean and that .
3. Make sure your code lints.
4. Issue that pull request!

## Report bugs using Github's [issues](https://github.com/zaniluca/ping-4-gitlab/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/zaniluca/ping-4-gitlab/issues/new?assignees=zaniluca&labels=bug&template=bug.md&title=Bug%3A+); it's that easy!

## Write bug reports with detail and a background

Bug reports are more than welcome, for the benefit of both parties be sure to be as specific as possible with your report

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce (Be specific!)
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)
  ì

## Use a Consistent Coding Style

To enforce a consistent style we use [prettier](https://prettier.io/) and [commitlint](https://commitlint.js.org/#/) (used via [husky](https://typicode.github.io/husky/#/))

At the moment we don't have any strict linter set up, we only check that commits complaints to the [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0/). Its very important that you stick to this convention as its validated when you commit your code (via husky) and with a github action on every pull request opened on `master`

But what if you messed up your commit messages and now the ci blocks your pull request? No problem you can simply reword your latest commits messages like this:

1. run `git rebase -i HEAD~n` where `n` is the number of commits you want to rename
2. the previous command will open up an editable text file with instructions; to rename your commits simply replace `pick` with `reword` before any commit you want to rename
3. then you can freely change the commit message to respect the [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0/)
4. after you're done force push the amended commits by running `git push --force`
