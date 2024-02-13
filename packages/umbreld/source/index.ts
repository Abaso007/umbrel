import path from 'node:path'

import fse from 'fs-extra'

import packageJson from '../package.json' assert {type: 'json'}

import createLogger, {type LogLevel} from './modules/utilities/logger.js'
import FileStore from './modules/utilities/file-store.js'

import Server from './modules/server/index.js'
import User from './modules/user.js'
import AppStore from './modules/apps/app-store.js'
import Apps from './modules/apps/apps.js'

type StoreSchema = {
	version: string
	apps: string[]
	appRepositories: string[]
	widgets: string[]
	torEnabled?: boolean
	user: {
		name: string
		hashedPassword: string
		totpUri?: string
		wallpaper?: string
	}
}

export type UmbreldOptions = {
	dataDirectory: string
	port?: number
	logLevel?: LogLevel
	defaultAppStoreRepo?: string
}

export default class Umbreld {
	version = packageJson.version
	dataDirectory: string
	port: number
	logLevel: LogLevel
	logger: ReturnType<typeof createLogger>
	store: FileStore<StoreSchema>
	server: Server
	user: User
	appStore: AppStore
	apps: Apps

	constructor({
		dataDirectory,
		port = 80,
		logLevel = 'normal',
		defaultAppStoreRepo = 'https://github.com/getumbrel/umbrel-apps.git',
	}: UmbreldOptions) {
		this.dataDirectory = path.resolve(dataDirectory)
		this.port = port
		this.logLevel = logLevel
		this.logger = createLogger('umbreld', this.logLevel)
		this.store = new FileStore<StoreSchema>({filePath: `${dataDirectory}/umbrel.yaml`})
		this.server = new Server({umbreld: this})
		this.user = new User(this)
		this.appStore = new AppStore(this, {defaultAppStoreRepo})
		this.apps = new Apps(this)
	}

	async start() {
		this.logger.log(`☂️  Starting Umbrel v${this.version}`)
		this.logger.log()
		this.logger.log(`dataDirectory: ${this.dataDirectory}`)
		this.logger.log(`port:          ${this.port}`)
		this.logger.log(`logLevel:      ${this.logLevel}`)
		this.logger.log()

		// Ensure data directory exists
		await fse.ensureDir(this.dataDirectory)

		// In the future we'll handle migrations here, for now lets just write the version to check read/write permissions are ok.
		await this.store.set('version', this.version)

		// Initialise modules
		await Promise.all([this.apps.start(), this.appStore.start(), this.server.start()])
	}
}
