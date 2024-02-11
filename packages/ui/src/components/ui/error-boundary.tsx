// import {useErrorBoundary} from 'react-error-boundary'
import {useRouteError} from 'react-router-dom'

import {ReloadPageButton} from '../reload-page-button'
import {BareCoverMessage} from './cover-message'

export function ErrorBoundary() {
	const error = useRouteError()
	// TODO: reset doesn't work
	// const {resetBoundary} = useErrorBoundary()
	// console.error(error)
	return (
		<BareCoverMessage>
			<div>
				<h1 className='font-semibold text-destructive2-lightest'>⚠ Dang!</h1>
				<p className='max-w-sm text-13'>{error instanceof Error ? error.message : 'Unexpected error'}</p>
				<div className='mt-2 flex items-center gap-2'>
					{/* <Button variant='secondary' size='sm' onClick={resetBoundary}>
						Try Again
					</Button> */}
					<ReloadPageButton />
				</div>
			</div>
		</BareCoverMessage>
	)
}
