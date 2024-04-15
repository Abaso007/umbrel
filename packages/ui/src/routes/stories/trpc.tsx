import {useEffect, useState} from 'react'
import {JSONTree} from 'react-json-tree'
import {Link} from 'react-router-dom'

import {Loading} from '@/components/ui/loading'
import {H3} from '@/layouts/stories'
import {RouterOutput, trpcReact, trpcUrl} from '@/trpc/trpc'
import {urlJoin} from '@/utils/misc'

const trpcEndpointUrl = urlJoin(trpcUrl, 'debug.sayHi')

export default function Trpc() {
	return (
		<div>
			<Link to={trpcEndpointUrl} className='underline'>
				Link to test DEBUG result
			</Link>
			<H3>Normal tRPC example</H3>
			<NormalUseQueryExample />
			<H3>Normal tRPC example 2</H3>
			<NormalUseQueryExample2 />
			<H3>Context example</H3>
			<ContextExample />
		</div>
	)
}

function NormalUseQueryExample() {
	const getQuery = trpcReact.user.get.useQuery()

	return <JSONTree data={getQuery.data} />
}

function NormalUseQueryExample2() {
	const res = trpcReact.system.online.useQuery()

	if (res.isLoading) {
		return <Loading />
	}

	if (res.error) {
		return <div>Error loading</div>
	}

	return (
		<div>
			<JSONTree data={res.data} />
		</div>
	)
}

function ContextExample() {
	const ctx = trpcReact.useContext()
	const [data, setData] = useState<RouterOutput['user']['get'] | null>(null)

	useEffect(() => {
		ctx.user.get.fetch().then((res) => {
			console.log(res)
			setData(res)
		})
	}, [ctx.user.get])

	return <JSONTree data={data} />
}
