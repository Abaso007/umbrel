import {useCommandState} from 'cmdk'
import {ComponentPropsWithoutRef, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {range} from 'remeda'

import {LOADING_DASH} from '@/constants'
import {useDebugInstallRandomApps} from '@/hooks/use-debug-install-random-apps'
import {useIsMobile} from '@/hooks/use-is-mobile'
import {useLaunchApp} from '@/hooks/use-launch-app'
import {useQueryParams} from '@/hooks/use-query-params'
import {systemAppsKeyed, useApps} from '@/providers/apps'
import {CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList} from '@/shadcn-components/ui/command'
import {Separator} from '@/shadcn-components/ui/separator'
import {trpcReact} from '@/trpc/trpc'
import {t} from '@/utils/i18n'

import {AppIcon} from './app-icon'
import {FadeScroller} from './fade-scroller'
import {DebugOnlyBare} from './ui/debug-only'

export function CmdkMenu({open, setOpen}: {open: boolean; setOpen: (open: boolean) => void}) {
	const navigate = useNavigate()
	const {addLinkSearchParams} = useQueryParams()
	const {userApps, isLoading} = useApps()
	const scrollRef = useRef<HTMLDivElement>(null)
	const userQ = trpcReact.user.get.useQuery()
	const launchApp = useLaunchApp()
	const isMobile = useIsMobile()
	const debugInstallRandomApps = useDebugInstallRandomApps()

	if (isLoading) return null
	if (!userApps) return null
	if (userQ.isLoading) return null

	const installedApps = userApps.filter((app) => app.state === 'ready')

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder={t('cmdk.input-placeholder')} />
			<Separator />
			<CommandList ref={scrollRef}>
				<FrequentApps />
				<CommandEmpty>{t('no-results-found')}</CommandEmpty>
				<CommandItem
					icon={systemAppsKeyed['settings'].icon}
					onSelect={() => {
						navigate({pathname: '/settings', search: addLinkSearchParams({dialog: 'restart'})})
						setOpen(false)
					}}
				>
					{t('cmdk.restart-umbrel')}
				</CommandItem>
				<CommandItem
					icon={systemAppsKeyed['app-store'].icon}
					onSelect={() => {
						navigate('/app-store?dialog=updates')
						setOpen(false)
					}}
				>
					{t('cmdk.update-all-apps')}
				</CommandItem>
				<CommandItem
					icon={systemAppsKeyed['settings'].icon}
					onSelect={() => {
						navigate(isMobile ? '/settings?dialog=wallpaper' : '/settings')
						setOpen(false)
					}}
				>
					{t('cmdk.change-wallpaper')}
				</CommandItem>
				<CommandItem
					icon={systemAppsKeyed['live-usage'].icon}
					onSelect={() => {
						navigate(systemAppsKeyed['live-usage'].systemAppTo)
						setOpen(false)
					}}
				>
					{t('cmdk.live-usage')}
				</CommandItem>
				<CommandItem
					icon={systemAppsKeyed['widgets'].icon}
					onSelect={() => {
						navigate('/edit-widgets')
						setOpen(false)
					}}
				>
					{t('cmdk.add-widgets')}
				</CommandItem>
				{installedApps.map((app) => (
					<SubItem
						value={app.name}
						icon={app.icon}
						key={app.id}
						onSelect={() => {
							launchApp(app.id)
							setOpen(false)
						}}
					>
						{app.name}
					</SubItem>
				))}
				<DebugOnlyBare>
					<SubItem value={t('install-a-bunch-of-random-apps')} onSelect={debugInstallRandomApps}>
						{t('install-a-bunch-of-random-apps')}
					</SubItem>
				</DebugOnlyBare>
				<SubItem
					value={systemAppsKeyed['home'].name}
					icon={systemAppsKeyed['home'].icon}
					onSelect={() => {
						navigate(systemAppsKeyed['home'].systemAppTo)
						setOpen(false)
					}}
				>
					{systemAppsKeyed['home'].name}
				</SubItem>
				<SubItem
					value={systemAppsKeyed['app-store'].name}
					icon={systemAppsKeyed['app-store'].icon}
					onSelect={() => {
						navigate(systemAppsKeyed['app-store'].systemAppTo)
						setOpen(false)
					}}
				>
					{systemAppsKeyed['app-store'].name}
				</SubItem>
				<SubItem
					value={systemAppsKeyed['settings'].name}
					icon={systemAppsKeyed['settings'].icon}
					onSelect={() => {
						navigate(systemAppsKeyed['settings'].systemAppTo)
						setOpen(false)
					}}
				>
					{systemAppsKeyed['settings'].name}
				</SubItem>
				<SubItem
					value={systemAppsKeyed['settings'].name}
					icon={systemAppsKeyed['settings'].icon}
					onSelect={() => {
						navigate({search: addLinkSearchParams({dialog: 'logout'})})
						setOpen(false)
					}}
				>
					{systemAppsKeyed['settings'].name}
				</SubItem>
			</CommandList>
		</CommandDialog>
	)
}

function FrequentApps() {
	const lastAppsQ = trpcReact.apps.recentlyOpened.useQuery(undefined, {
		retry: false,
	})
	const lastApps = lastAppsQ.data ?? []
	const {userAppsKeyed} = useApps()

	const search = useCommandState((state) => state.search)

	// If there's a search query, don't show frequent apps
	if (search) return null
	if (!userAppsKeyed) return null
	if (!lastApps) return null
	if (lastApps.length === 0) return null

	return (
		<div className='mb-3 flex flex-col gap-3 md:mb-5 md:gap-5'>
			<div>
				<h3 className='mb-5 hidden text-15 font-semibold leading-tight -tracking-2 md:block'>
					{t('cmdk.frequent-apps')}
				</h3>
				<FadeScroller direction='x' className='umbrel-hide-scrollbar w-full overflow-x-auto whitespace-nowrap'>
					{/* Show skeleton by default to prevent layout shift */}
					{lastAppsQ.isLoading &&
						range(0, 3).map((i) => <FrequentApp key={i} appId={''} icon='' name={LOADING_DASH} />)}
					{appsByFrequency(lastApps, 6).map((appId) => (
						<FrequentApp
							key={appId}
							appId={appId}
							icon={userAppsKeyed[appId]?.icon}
							name={userAppsKeyed[appId]?.name}
						/>
					))}
				</FadeScroller>
			</div>

			<Separator />
		</div>
	)
}

function appsByFrequency(lastOpenedApps: string[], count: number) {
	const openCounts = new Map<string, number>()

	lastOpenedApps.map((appId) => {
		if (!openCounts.has(appId)) {
			openCounts.set(appId, 1)
		} else {
			openCounts.set(appId, openCounts.get(appId)! + 1)
		}
	})

	const sortedAppIds = [...openCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, count)
		.map((a) => a[0])

	return sortedAppIds
}

function FrequentApp({appId, icon, name}: {appId: string; icon: string; name: string}) {
	const launchApp = useLaunchApp()
	const isMobile = useIsMobile()
	return (
		<button
			className='inline-flex w-[75px] flex-col items-center gap-2 overflow-hidden rounded-8 border border-transparent p-1.5 outline-none transition-all hover:border-white/10 hover:bg-white/4 focus-visible:border-white/10 focus-visible:bg-white/4 active:border-white/20 md:w-[100px] md:p-2'
			onClick={() => launchApp(appId)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					// Prevent triggering first selected cmdk item
					e.preventDefault()
					launchApp(appId)
				}
			}}
		>
			<AppIcon src={icon} size={isMobile ? 48 : 64} className='rounded-8 md:rounded-15' />
			<div className='w-full truncate text-[10px] -tracking-2 text-white/75 md:text-13'>{name ?? appId}</div>
		</button>
	)
}

const SubItem = (props: ComponentPropsWithoutRef<typeof CommandItem>) => {
	const search = useCommandState((state) => state.search)
	if (!search) return null

	return <CommandItem {...props} />
}

export function useCmdkOpen() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	return {open, setOpen}
}
