import { defineConfig } from 'cypress'
import fs from 'fs-extra'
import path from 'path'
import pluginMocha from 'cypress-mochawesome-reporter/plugin.js'

const getConfigurationByFile = (file) => {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: `reports_${new Date().toLocaleString().replace(',', '')}`
  },
  e2e: {
    setupNodeEvents(on, config) {
      pluginMocha(on)
      const file = config.env.configFile || 'dev'

      return getConfigurationByFile(file)
    }
  }
})
