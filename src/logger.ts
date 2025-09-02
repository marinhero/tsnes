type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'

const logSuccess = (message: string) => {
  console.log('\x1b[32m[+] %s\x1b[0m', message)
}

const logInfo = (message: string) => {
  console.log('\x1b[34m[-] %s\x1b[0m', message)
}

const logWarn = (message: string) => {
  console.log('\x1b[33m[!] %s\x1b[0m', message)
}

const logError = (message: string) => {
  console.log('\x1b[31m[X] %s\x1b[0m', message)
}

export class Logger {
  level: LogLevel

  constructor() {
    this.level = 'INFO'
  }

  log(message: string, info: LogLevel = 'INFO') {
    switch (info) {
      case 'ERROR':
        logError(message)
        break
      case 'WARN':
        logWarn(message)
        break
      case 'SUCCESS':
        logSuccess(message)
        break
      default:
        logInfo(message)
    }
  }
}
