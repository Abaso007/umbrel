import BigNumber from 'bignumber.js'
import {sort} from 'remeda'

import {trpcReact} from '@/trpc/trpc'
import {maybePrettyBytes} from '@/utils/pretty-bytes'
import {isDiskFull, isDiskLow, trpcDiskToLocal} from '@/utils/system'

export function useDisk(options: {poll?: boolean} = {}) {
	const diskQ = trpcReact.system.diskUsage.useQuery(undefined, {
		// Sometimes we won't be able to get disk usage, so prevent retry
		retry: false,
		// We do want refetching to happen on a schedule though
		refetchInterval: options.poll ? 500 : undefined,
	})

	const transformed = trpcDiskToLocal(diskQ.data)

	return {
		data: diskQ.data,
		isLoading: diskQ.isLoading,
		//
		...transformed,
		apps: sort(diskQ.data?.apps ?? [], (a, b) => b.used - a.used),
		isDiskLow: isDiskLow(transformed?.available),
		isDiskFull: isDiskFull(transformed?.available),
	}
}

export function useDiskForUi(options: {poll?: boolean} = {}) {
	const {isLoading, used, size, available, apps, isDiskFull, isDiskLow} = useDisk({poll: options.poll})

	if (isLoading) {
		return {
			value: '–',
			valueSub: '/ –',
			secondaryValue: '– left',
			progress: 0,
		}
	}

	return {
		value: maybePrettyBytes(used),
		valueSub: `/ ${maybePrettyBytes(size)}`,
		secondaryValue: `${maybePrettyBytes(available)} left`,
		progress: BigNumber(used ?? 0 * 100)
			.dividedBy(size ?? 0)
			.toNumber(),
		isDiskLow,
		isDiskFull,
		apps,
	}
}
