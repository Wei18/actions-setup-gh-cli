import * as core from '@actions/core'
import * as os from 'os'

import {cacheFile, downloadTool, extractTar, find} from '@actions/tool-cache'
import {chmodSync} from 'fs'
import {HttpClient} from '@actions/http-client'

const GH_CLI_TOOL_NAME = 'gh'

run()

async function run(): Promise<void> {
  try {
    await install()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

/**
 * Install the GH CLI in self hosted runner
 */
async function install(): Promise<void> {
  core.info('Installing gh cli in self hosted runner')

  const version = core.getInput('version') || (await getLatestVersion())

  const platform = core.getInput('platform') || os.platform()

  const arch = core.getInput('arch') || os.arch()

  const architecture =
    arch === 'x64' ? 'amd64' : arch === 'arm64' ? 'arm64' : 'amd64'

  const packageUrl = `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_${platform}_${architecture}.tar.gz`

  core.info(`Downloading gh cli from ${packageUrl}`)

  let cliPath = find(GH_CLI_TOOL_NAME, version)

  if (!cliPath) {
    const downloadPath = await downloadTool(packageUrl, 'gh_tar')
    chmodSync(downloadPath, '755')
    cliPath = await extractTar(downloadPath, find(GH_CLI_TOOL_NAME, version))
    cliPath = await cacheFile(
      `${cliPath}/gh_${version}_${platform}_${architecture}/bin/gh`,
      'gh',
      GH_CLI_TOOL_NAME,
      version
    )
  }

  core.addPath(cliPath)
  core.info('gh cli installed successfully')
}

async function getLatestVersion(): Promise<string> {
  const http = new HttpClient('gh-release')
  const response = await http.getJson(
    'https://api.github.com/repos/cli/cli/releases/latest'
  )
  let latestVersion = (response.result as {tag_name: string}).tag_name
  latestVersion = latestVersion.startsWith('v')
    ? latestVersion.substring(1)
    : latestVersion
  return latestVersion
}
