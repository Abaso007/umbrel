import {indexBy} from 'remeda'

import {Arc} from '@/components/ui/arc'
import {settingsWidgets} from '@/hooks/use-widgets'
import {H2, H3} from '@/layouts/stories'
import {usePager} from '@/modules/desktop/app-grid/app-pagination-utils'
import {Widget} from '@/modules/widgets'
import {ActionsWidget} from '@/modules/widgets/actions-widget'
import {RegistryWidget, WidgetType} from '@/modules/widgets/constants'
import {FourUpWidget} from '@/modules/widgets/four-up-widget'
import {NotificationsWidget} from '@/modules/widgets/notifications-widget'
import {ProgressWidget} from '@/modules/widgets/progress-widget'
import {WidgetWrapper} from '@/modules/widgets/shared/widget-wrapper'
import {StatWithButtonsWidget} from '@/modules/widgets/stat-with-buttons-widget'
import {ThreeUpWidget} from '@/modules/widgets/three-up-widget'
import {TwoUpWidget} from '@/modules/widgets/two-up-widget'
import {AppsProvider} from '@/providers/apps'
import {tw} from '@/utils/tw'

export const demoWidgetConfigs = [
	{
		appId: 'bitcoin',
		widgets: [
			{
				id: 'bitcoin:sync',
				type: 'stat-with-progress',
				endpoint: '/widgets/bitcoin/sync.json',
			},
			{
				id: 'bitcoin:stats',
				type: 'four-up',
				endpoint: '/widgets/bitcoin/stats.json',
			},
		],
	},
	{
		appId: 'lightning',
		widgets: [
			{
				id: 'lightning:balance-and-transact',
				type: 'stat-with-buttons',
				endpoint: '/widgets/lightning/balance-and-transact.json',
			},
			{
				id: 'lightning:connections',
				type: 'four-up',
				endpoint: '/widgets/lightning/connections.json',
			},
		],
	},
	{
		appId: 'nostr-relay',
		widgets: [
			{
				id: 'nostr-relay:stats',
				type: 'actions',
				endpoint: '/widgets/nostr-relay/actions.json',
			},
			{
				id: 'nostr-relay:notifications',
				type: 'notifications',
				endpoint: '/widgets/nostr-relay/notifications.json',
			},
		],
	},
] satisfies {
	appId: string
	widgets: RegistryWidget<WidgetType>[]
}[]

export const demoWidgetConfigsKeyed = indexBy(demoWidgetConfigs, (widget) => widget.appId)

export default function WidgetsStory() {
	const {pageInnerRef} = usePager({apps: [], widgets: []})

	const handleClick = () => {
		alert('clicked')
	}

	return (
		<AppsProvider>
			<div className='bg-white/30' ref={pageInnerRef}>
				<H2>Error</H2>
				<div className={sectionClass}>
					<Widget
						appId='example'
						config={{
							id: 'example:error',
							type: 'stat-with-progress',
							endpoint: '/widgets/example/four-up.json',
						}}
					/>
				</div>
				{/* <H2>Blank</H2>
				<div className={sectionClass}>
					<WidgetWrapper label='stat-with-progress'>
						<ProgressWidget />
					</WidgetWrapper>
					<WidgetWrapper label='stat-with-buttons'>
						<StatWithButtonsWidget />
					</WidgetWrapper>
					<WidgetWrapper label='three-up'>
						<ThreeUpWidget />
					</WidgetWrapper>
					<WidgetWrapper label='four-up'>
						<FourUpWidget />
					</WidgetWrapper>
					<WidgetWrapper label='actions'>
						<ActionsWidget />
					</WidgetWrapper>
					<WidgetWrapper label='notifications'>
						<NotificationsWidget />
					</WidgetWrapper>
				</div> */}
				<H2>Widget Types</H2>
				<H3>stat-with-buttons</H3>
				<div className={sectionClass}>
					<StatWithButtonsWidget />
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Bitcoin Wallet'
						value='1,845,893'
						valueSub='sats'
						// @ts-expect-error expecting title
						buttons={[{link: '/send'}]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Bitcoin Wallet'
						value='1,845,893'
						valueSub='sats'
						buttons={[{title: 'Send', link: '/send'}]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Bitcoin Wallet'
						value='1,845,893'
						valueSub='sats'
						buttons={[{icon: 'send', title: 'Send', link: '/send'}]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Bitcoin Wallet'
						value='1,845,893'
						valueSub='sats'
						buttons={[
							{icon: 'send', title: 'Send', link: '/send'},
							{icon: 'inbox', title: 'Receive', link: '/receive'},
						]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Bitcoin Wallet'
						value='1,845,893'
						valueSub='sats'
						buttons={[
							{icon: 'send', title: 'Send', link: '/send'},
							{icon: 'inbox', title: 'Receive', link: '/receive'},
							{icon: 'inbox', title: 'Receive', link: '/receive'},
						]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.'
						value='Lorem'
						valueSub='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod'
						buttons={[
							{
								icon: 'send',
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod',
								link: '/send',
							},
						]}
					/>
					<StatWithButtonsWidget
						onClick={handleClick}
						title='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.'
						value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod'
						valueSub='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod'
						buttons={[
							{
								// icon: 'send',
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod',
								link: '/send',
							},
							{
								// icon: 'inbox',
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod',
								link: '/receive',
							},
							{
								icon: 'inbox',
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod',
								link: '/receive',
							},
						]}
					/>
				</div>
				<H3>stat-with-progress</H3>
				<div className={sectionClass}>
					<ProgressWidget />
					<ProgressWidget
						title='Storage'
						value='256 GB'
						valueSub='/ 2 TB'
						progressLabel='1.75 TB left'
						progress={0.25}
					/>
				</div>
				<H3>two-up-stat-with-progress</H3>
				<div className={sectionClass}>
					<TwoUpWidget />
					<TwoUpWidget
						// @ts-expect-error expecting 2 items
						items={[
							{
								title: 'CPU',
								value: '4.2',
								valueSub: 'GHz',
								progress: 0.25,
							},
						]}
					/>
					<TwoUpWidget
						items={[
							{
								// title: 'CPU',
								value: '4.2',
								valueSub: 'GHz',
								progress: 0.75,
							},
							{
								// title: 'CPU',
								value: '4.2',
								valueSub: 'GHz',
								progress: 0.75,
							},
						]}
					/>
					<TwoUpWidget
						items={[
							{
								title: 'CPU',
								// value: '4.2',
								// valueSub: 'GHz',
								progress: 0.75,
							},
							{
								title: 'CPU',
								// value: '4.2',
								// valueSub: 'GHz',
								progress: 0.75,
							},
						]}
					/>
					<TwoUpWidget
						items={[
							{
								title: 'CPU',
								value: '4.2',
								valueSub: 'GHz',
								progress: 0.75,
							},
							{
								title: 'CPU',
								value: '4.2',
								valueSub: 'GHz',
								progress: 0.75,
							},
						]}
					/>
					<TwoUpWidget
						items={[
							{
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
								value: 'Lorem ipsum',
								valueSub: 'GHz',
								progress: 0.75,
							},
							{
								title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
								value: 'Lorem ipsum',
								valueSub: 'GHz',
								progress: 0.75,
							},
						]}
					/>
					<Arc strokeWidth={5} size={65} progress={0.0} />
					<Arc strokeWidth={5} size={65} progress={0.25} />
					<Arc strokeWidth={5} size={65} progress={0.5} />
					<Arc strokeWidth={5} size={65} progress={0.75} />
					<Arc strokeWidth={5} size={65} progress={1} />
				</div>
				<H3>three-up</H3>
				<div className={sectionClass}>
					<ThreeUpWidget />
					<ThreeUpWidget
						// @ts-expect-error expecting 3 items
						items={[{icon: 'cpu', title: 'CPU', value: '4.2 GHz'}]}
					/>
					<ThreeUpWidget
						// @ts-expect-error expecting 3 items
						items={[
							{icon: 'cpu', title: 'CPU', value: '4.2 GHz'},
							{icon: 'cpu', title: 'Memory', value: '16 GB'},
						]}
					/>
					<ThreeUpWidget
						items={[
							{icon: '', title: 'CPU', value: '4.2 GHz'},
							{icon: '', title: 'Memory', value: '16 GB'},
							{icon: '', title: 'Storage', value: '256 GB'},
							// {icon: 'hard-drive', title: 'Storage', value: '256 GB'},
						]}
					/>
					<ThreeUpWidget
						items={[
							{icon: 'cpu', title: 'CPU', value: '4.2 GHz'},
							{icon: 'cpu', title: 'Memory', value: '16 GB'},
							{icon: 'cpu', title: 'Storage', value: '256 GB'},
						]}
					/>
					<ThreeUpWidget
						items={[
							{icon: 'cpu', title: 'CPU', value: '4.2 GHz'},
							{icon: 'cpu', title: 'Memory', value: '16 GB'},
							{icon: 'cpu', title: 'Storage', value: '256 GB'},
							// @ts-expect-error expecting 3 items
							{icon: 'cpu', title: 'Storage', value: '256 GB'},
						]}
					/>
					<ThreeUpWidget
						items={[
							{icon: 'cpu', title: 'Lorem ipsum dolor', value: 'Lorem ipsum dolor'},
							{icon: 'cpu', title: 'Lorem ipsum dolor', value: 'Lorem ipsum dolor'},
							{icon: 'cpu', title: 'Lorem ipsum dolor', value: 'Lorem ipsum dolor'},
						]}
					/>
				</div>
				<H3>four-up</H3>
				<div className={sectionClass}>
					<FourUpWidget />
					<FourUpWidget
						items={[
							{title: 'CPU', value: '4.2', valueSub: 'GHz'},
							{title: 'Memory', value: '16', valueSub: 'GB'},
							{title: 'Storage', value: '256', valueSub: 'GB'},
							{title: 'Storage', value: '256', valueSub: 'GB'},
						]}
					/>
					<FourUpWidget onClick={handleClick} items={[{title: 'CPU', value: '4.2', valueSub: 'GHz'}]} />
				</div>
				<H3>actions</H3>
				<div className={sectionClass}>
					<ActionsWidget />
					<ActionsWidget count={1} actions={[{emoji: '😍', title: 'Message heartted'}]} />
					<ActionsWidget
						count={123}
						actions={[
							{title: 'Message heartted'},
							{title: 'Booo!!'},
							{title: 'Rain expected'},
							{title: 'Search started'},
							{title: 'lskdfjsdlkfjsdlfkj'},
						]}
					/>
					<ActionsWidget
						count={123}
						actions={[
							{emoji: '😍', title: 'Message heartted'},
							{emoji: '👻', title: 'Booo!!'},
							{emoji: '☂️', title: 'Rain expected'},
							{emoji: '🔍', title: 'Search started'},
							{emoji: '❤️', title: 'lskdfjsdlkfjsdlfkj'},
						]}
					/>
					<ActionsWidget
						count={123123123}
						actions={[
							{emoji: '😍', title: 'Message heartted'},
							{emoji: '👻', title: 'Booo!!'},
							{emoji: '☂️', title: 'Rain expected'},
							{emoji: '🔍', title: 'Search started'},
							{emoji: '❤️', title: 'lskdfjsdlkfjsdlfkj'},
						]}
					/>
					<ActionsWidget
						count={123123123123123}
						actions={[
							{emoji: '😍😍😍😍', title: 'Message heartted'},
							{emoji: '👻', title: 'Booo!!'},
							{emoji: '☂️', title: 'Rain expected'},
							{emoji: '🔍', title: 'Search started'},
							{emoji: '❤️', title: 'lskdfjsdlkfjsdlfkj'},
						]}
					/>
				</div>
				<H3>notifications</H3>
				<div className={sectionClass}>
					<NotificationsWidget />
					<NotificationsWidget
						onClick={handleClick}
						notifications={[
							{
								timestamp: 1620000000000,
								description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
							},
							{
								timestamp: 1620000000000,
								description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
							},
						]}
					/>
					<NotificationsWidget
						onClick={handleClick}
						notifications={[
							{
								timestamp: 1620000000000,
								description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod.',
							},
						]}
					/>
				</div>
				{/* ------------------------------------ */}
				<H2>With widget wrapper</H2>
				<WidgetWrapper label='fooo'>
					<ActionsWidget />
				</WidgetWrapper>
				{/* ------------------------------------ */}
				<H2>Connected</H2>
				<H3>settings</H3>
				<div className='flex flex-wrap gap-2'>
					{settingsWidgets.map((widget) => (
						<WidgetWrapper key={widget.endpoint} label={widget.type}>
							<Widget appId='example' config={widget} />
						</WidgetWrapper>
					))}
				</div>
				{demoWidgetConfigs.map((app) => (
					<>
						<H3>{app.appId}</H3>
						<div className='flex flex-wrap gap-2'>
							{app.widgets.map((widget, i) => (
								<WidgetWrapper key={i} label={widget.type}>
									<Widget appId={app.appId} config={widget} />
								</WidgetWrapper>
							))}
						</div>
					</>
				))}
				<WidgetWrapper label={'two-up-stat-with-progress'}>
					<Widget
						appId='settings'
						config={{
							id: 'settings:system-stats',
							type: 'two-up-stat-with-progress',
							endpoint: '/widgets/example/two-up-example.json',
						}}
					/>
				</WidgetWrapper>
			</div>
		</AppsProvider>
	)
}

const sectionClass = tw`flex flex-wrap gap-2 p-5`
