import { defineConfig } from 'cypress'
import fs from 'fs-extra'
import path from 'path'
import pluginMocha from 'cypress-mochawesome-reporter/plugin.js'
import { beforeRunHook } from 'cypress-mochawesome-reporter/lib/index.js'

const getConfigurationByFile = (file) => {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: `reports_${new Date().toLocaleString().replace(',', '')}`,
    overwrite: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      pluginMocha(on)
      on('before:run', async (details) => {
        await beforeRunHook(details)
      })

      const file = config.env.configFile || 'dev'

      return getConfigurationByFile(file)
    }
  }
})
