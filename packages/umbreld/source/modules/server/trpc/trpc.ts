import {ZodError} from 'zod'
import {initTRPC} from '@trpc/server'

import {type Context} from './context.js'
import {isAuthenticated} from './is-authenticated.js'

export const t = initTRPC.context<Context>().create({
	// TODO: Add more context on why this is needed
	// https://trpc.io/docs/server/error-formatting#adding-custom-formatting
	errorFormatter(options) {
		const {shape, error} = options
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.code === 'BAD_REQUEST' && error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		}
	},
})
export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuthenticated)
