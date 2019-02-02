# Git Guidelines

###Table of content:
1. [Branches](#branches)
2. [Commit message](#commit-message)
3. [Issues](#issues)


## Branches

#### Master branch

The `master` branch should be kept stable at all times.

Any kind of work in progress should be kept in a separate branch.

#### Branch naming

Choose short and descriptive names.

Use hyphens to separate words.

e.g.: *telegram-login-scene*

#### Branch lifecycle

Delete your branch from the upstream repository after it's merged, unless there is a specific reason not to.

## Commit message

Subject of a message should end with the reference to the issue. You can find issue number right after it's name.

e.g: #11 refers to *Discuss folder and project structures* issue, so commit message might be *Add git guidelines #11*

Message should correspond to the next rules:

#### The seven rules of a great Git commit message
1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. how

More details with examples: [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

## Issues

#### Tags

Add tag that coresponds to its part of the project: *telegram, viber, web page, main-module, db*, etc.
