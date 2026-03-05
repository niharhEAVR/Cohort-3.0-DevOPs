/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return Response.json({
			message: `I wants a girlfriend!`,
			message2: `I wants a girlfriend!`,
			message3: `I wants a girlfriend!`,
			message4: `I wants a girlfriend!`,
			message5: `I wants a girlfriend!`,
			message6: `I wants a girlfriend!`,
			message7: `I wants a girlfriend!`,
			message8: `I wants a girlfriend!`,
			message9: `I wants a girlfriend!`,
			message10: `I wants a girlfriend!`,
		});
	},
} satisfies ExportedHandler<Env>;
