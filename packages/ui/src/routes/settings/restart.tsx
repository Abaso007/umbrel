import {RiRestartLine} from 'react-icons/ri'
import {useNavigate} from 'react-router-dom'

import {CoverMessage, CoverMessageParagraph} from '@/components/ui/cover-message'
import {Loading} from '@/components/ui/loading'
import {useUmbrelTitle} from '@/hooks/use-umbrel-title'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/shadcn-components/ui/alert-dialog'
import {trpcReact} from '@/trpc/trpc'
import {afterDelayedClose} from '@/utils/dialog'

export default function RestartDialog() {
	useUmbrelTitle('Restart')
	const navigate = useNavigate()

	const restartMut = trpcReact.system.reboot.useMutation()

	// TODO: redirect to `/restart` route instead of showing this cover message
	if (restartMut.isLoading) {
		return (
			<CoverMessage>
				<Loading>Restarting</Loading>
				<CoverMessageParagraph>
					Please do not refresh this page or turn off your Umbrel while it is restarting.
				</CoverMessageParagraph>
			</CoverMessage>
		)
	}

	if (restartMut.isError) {
		return <CoverMessage>Failed to restart.</CoverMessage>
	}

	return (
		<AlertDialog defaultOpen onOpenChange={afterDelayedClose(() => navigate('/settings', {preventScrollReset: true}))}>
			<AlertDialogContent>
				<AlertDialogHeader icon={RiRestartLine}>
					<AlertDialogTitle>Are you sure you want to restart your Umbrel?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						variant='destructive'
						className='px-6'
						onClick={(e) => {
							// Prevent closing by default
							e.preventDefault()
							restartMut.mutate()
						}}
					>
						Restart
					</AlertDialogAction>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
