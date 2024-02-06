import {cn} from '@/shadcn-lib/utils'
import {RegistryApp} from '@/trpc/trpc'
import {tw} from '@/utils/tw'

import {cardClass, cardTitleClass, ReadMoreMarkdownSection} from './shared'

export const AboutSection = ({app}: {app: RegistryApp}) => (
	<div className={cn(cardClass, 'gap-2.5')}>
		<h2 className={cardTitleClass}>About</h2>
		<ReadMoreMarkdownSection collapseClassName={tw`line-clamp-6`}>{app.description}</ReadMoreMarkdownSection>
	</div>
)
