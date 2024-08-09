import { defineConfig } from 'cypress'
import fs from 'fs-extra'
import path from 'path'

const getConfigurationByFile = (file) => {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const file = config.env.configFile || 'dev'

      return getConfigurationByFile(file)
    }
  }
})
