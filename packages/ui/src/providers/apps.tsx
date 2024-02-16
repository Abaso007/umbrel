import {createContext, useContext} from 'react'

import {trpcReact, UserApp} from '@/trpc/trpc'
import {keyBy} from '@/utils/misc'

type AppT = {
	id: string
	name: string
	icon: string
	systemApp?: boolean
	systemAppTo?: string
}

export const systemApps = [
	{
		id: 'system',
		name: 'System',
		icon: '/figma-exports/umbrel-app.svg',
		systemApp: true,
		systemAppTo: '/',
	},
	// For the dock...
	{
		id: 'home',
		name: 'Home',
		icon: '/figma-exports/dock-home.png',
		systemApp: true,
		systemAppTo: '/',
	},
	{
		id: 'app-store',
		name: 'App Store',
		icon: '/figma-exports/dock-app-store.png',
		systemApp: true,
		systemAppTo: '/app-store',
	},
	{
		id: 'settings',
		name: 'Settings',
		icon: '/figma-exports/dock-settings.png',
		systemApp: true,
		systemAppTo: '/settings',
	},
	{
		id: 'live-usage',
		name: 'Live Usage',
		icon: '/figma-exports/dock-live-usage.png',
		systemApp: true,
		// NOTE: using this will clear existing search params
		// In practice, this means cmdk will clear params and clicking dock icon will not
		systemAppTo: '?dialog=live-usage',
	},
	{
		id: 'widgets',
		name: 'Widgets',
		icon: '/figma-exports/dock-widgets.png',
		systemApp: true,
		systemAppTo: '/edit-widgets',
	},
] as const satisfies readonly AppT[]

export const systemAppsKeyed = keyBy(systemApps, 'id')

type AppsContextT = {
	userApps?: UserApp[]
	userAppsKeyed?: Record<string, UserApp>
	// needs to be explicitly readonly so typescript doesn't complain, though all other props are technically readonly too
	systemApps: readonly AppT[]
	systemAppsKeyed: typeof systemAppsKeyed
	allApps: AppT[]
	allAppsKeyed: Record<string, AppT>
	isLoading: boolean
}
const AppsContext = createContext<AppsContextT | null>(null)

export function AppsProvider({children}: {children: React.ReactNode}) {
	const appsQ = trpcReact.apps.list.useQuery()

	const userApps = appsQ.data ?? []
	const userAppsKeyed = keyBy(userApps, 'id')

	const allApps = [...userApps, ...systemApps]
	const allAppsKeyed = keyBy(allApps, 'id')

	return (
		<AppsContext.Provider
			value={{
				// @ts-expect-error `userApps`
				userApps,
				// @ts-expect-error `userAppsKeyed`
				userAppsKeyed,
				systemApps,
				systemAppsKeyed,
				allApps,
				allAppsKeyed,
				isLoading: appsQ.isLoading,
			}}
		>
			{children}
		</AppsContext.Provider>
	)
}

export function useApps() {
	const ctx = useContext(AppsContext)
	if (!ctx) throw new Error('useApps must be used within AppsProvider')

	return ctx
}

export function useUserApp(id?: string | null) {
	const ctx = useContext(AppsContext)
	if (!ctx) throw new Error('useUserApp must be used within AppsProvider')

	if (!id) return {isLoading: false, app: undefined} as const
	if (ctx.isLoading) return {isLoading: true} as const

	return {
		isLoading: false,
		app: ctx.userAppsKeyed?.[id],
	} as const
}
