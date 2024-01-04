# Setup gh cli action

This repository contains the GitHub Actions for installing the GitHub CLI in
self-hosted runners. While the GitHub CLI is readily available in the
GitHub-hosted cloud runners, in self-hosted runners, this action enables the
installation of the GitHub CLI.

## Usage

To install the GitHub CLI, use the action as shown below:

```yaml
build:
  runs-on: [self-hosted]
  steps:
    - uses: actions/checkout@v2
    - name: Install the GitHub CLI
      uses: emasphere/actions-setup-gh-cli@v3
      with:
        version: 2.24.3
        # Optional: Specify the platform (linux, macos or windows). If not specified, the platform is automatically detected.
        platform: macOS
        # Optional: Specify the architecture (amd64 or arm64). If not specified, the system architecture is automatically detected.
        arch: amd64
    - run: |
        gh version
```
