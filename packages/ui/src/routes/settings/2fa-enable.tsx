import {motion} from 'framer-motion'
import {ReactNode, useEffect} from 'react'
import QRCode from 'react-qr-code'

import {CopyableField} from '@/components/ui/copyable-field'
import {PinInput} from '@/components/ui/pin-input'
import {UmbrelHeadTitle} from '@/components/umbrel-head-title'
import {use2fa} from '@/hooks/use-2fa'
import {useIsMobile} from '@/hooks/use-is-mobile'
import {useSettingsDialogProps} from '@/routes/settings/_components/shared'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogPortal,
	DialogTitle,
} from '@/shadcn-components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerScroller,
	DrawerTitle,
} from '@/shadcn-components/ui/drawer'
import {Separator} from '@/shadcn-components/ui/separator'
import {useDialogOpenProps} from '@/utils/dialog'
import {t} from '@/utils/i18n'
import {tw} from '@/utils/tw'

export default function TwoFactorEnableDialog() {
	const title = t('2fa.enable.title')
	const isMobile = useIsMobile()

	const dialogProps = useSettingsDialogProps()

	const scanThisMessage = t('2fa.enable.scan-this')

	if (isMobile) {
		return (
			<Drawer {...dialogProps}>
				<DrawerContent fullHeight>
					<DrawerHeader>
						<UmbrelHeadTitle>{title}</UmbrelHeadTitle>
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{t('2fa.enable.description')}</DrawerDescription>
					</DrawerHeader>
					<DrawerScroller>
						<p className={paragraphClass}>{scanThisMessage}</p>
						<div className='flex flex-col items-center gap-5'>
							{/* NOTE: keep this small so that the pin input is visible within the viewport */}
							<Inner qrCodeSize={150} />
							<div className='mb-4' />
						</div>
					</DrawerScroller>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Dialog {...dialogProps}>
			<DialogPortal>
				<DialogContent className='flex flex-col items-center gap-5'>
					<DialogHeader>
						<UmbrelHeadTitle>{title}</UmbrelHeadTitle>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{scanThisMessage}</DialogDescription>
					</DialogHeader>
					<Inner />
				</DialogContent>
			</DialogPortal>
		</Dialog>
	)
}

const paragraphClass = tw`text-left text-13 font-normal leading-tight -tracking-2 text-white/40`

function Inner({qrCodeSize = 240}: {qrCodeSize?: number}) {
	const dialogProps = useDialogOpenProps('2fa-enable')
	const {enable, totpUri, generateTotpUri} = use2fa(() => dialogProps.onOpenChange(false))

	useEffect(generateTotpUri, [generateTotpUri])

	if (!totpUri) return null

	return (
		<>
			<AnimateInQr size={qrCodeSize}>
				<QRCode
					size={256}
					style={{height: 'auto', maxWidth: '100%', width: '100%'}}
					value={totpUri}
					viewBox={`0 0 256 256`}
				/>
			</AnimateInQr>
			<div className='w-full space-y-2 text-center'>
				<p className='text-15 font-normal -tracking-2 opacity-60'>{t('2fa.enable.or-paste')}</p>
				<CopyableField value={totpUri} />
			</div>
			<Separator />
			<p className='text-center text-17 font-normal leading-tight -tracking-2'>{t('2fa.enter-code')}</p>
			<PinInput autoFocus length={6} onCodeCheck={enable} />
		</>
	)
}

const AnimateInQr = ({children, size}: {children: ReactNode; size: number}) => (
	<div
		className='relative mx-auto'
		style={{
			perspective: '300px',
			width: size + 'px',
		}}
	>
		<motion.div
			className='rounded-8 bg-white p-3'
			initial={{
				opacity: 0,
				rotateX: 20,
				rotateY: 10,
				rotateZ: 0,
				scale: 0.5,
			}}
			animate={{
				opacity: 1,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				scale: 1,
			}}
			transition={{duration: 0.15, ease: 'easeOut'}}
		>
			{children}
		</motion.div>
	</div>
)
