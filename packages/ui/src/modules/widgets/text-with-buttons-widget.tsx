import {ReactNode} from 'react'
import {take} from 'remeda'

import {LOADING_DASH} from '@/constants'

import {WidgetContainer} from './shared/shared'
import {StatText} from './shared/stat-text'
import {TablerIcon} from './shared/tabler-icon'

export function StatWithButtonsWidget({
	title,
	value,
	valueSub,
	buttons,
	onClick,
}: {
	title?: string
	value?: string
	valueSub?: string
	buttons?: {
		icon?: string
		text: string
		link: string
	}[]
	onClick?: (link: string) => void
}) {
	return (
		<WidgetContainer className='gap-0 p-2 md:p-5'>
			<StatText title={title ?? LOADING_DASH} value={value} valueSub={valueSub} />
			<div className='flex-1' />
			<div className='flex flex-col gap-1 md:flex-row'>
				{buttons &&
					take(buttons, 3).map((button) => (
						// Not using endpoint for `key` in case user wants two buttons to link to the same endpoint for some reason
						<WidgetButton key={button.text} onClick={() => onClick?.(button.link)}>
							{button.icon && <TablerIcon iconName={button.icon} className='mr-1 h-4 w-4 [&>svg]:h-4 [&>svg]:w-4' />}
							<span className='truncate'>{button.text}</span>
						</WidgetButton>
					))}
			</div>
		</WidgetContainer>
	)
}

function WidgetButton({onClick, children}: {onClick: () => void; children: ReactNode}) {
	return (
		<button
			onClick={onClick}
			className='flex h-[24px] min-w-0 flex-1 cursor-pointer select-none items-center justify-center rounded-5 bg-white/5 px-2.5 text-12 font-medium transition-colors hover:bg-white/10 active:bg-white/5 md:h-[30px] md:rounded-full'
		>
			{children}
		</button>
	)
}
