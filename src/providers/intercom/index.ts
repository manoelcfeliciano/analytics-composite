import { Client, Operators } from 'intercom-client';
import { IntercomAnalytics } from '~/protocols/intercom';

export class IntercomAnalyticsProviderAdapter implements IntercomAnalytics {
	private readonly client: Client | null;

	constructor(token: string | undefined | null) {
		if (token) {
			this.client = new Client({ tokenAuth: { token } });
		}
	}

	public report = async (name: string, params: IntercomAnalytics.Params): Promise<void> => {
		const { user, metadata } = params;

		if (!this.client) {
			console.log('You haven`t setup an API token for Intercom. Skipping event logging...');
			return;
		}

		const contact = await this.client.contacts.search({
			data: {
				query: {
					operator: Operators.AND,
					value: [{ field: 'external_id', operator: Operators.EQUALS, value: user.id }],
				},
			},
		});

		if (contact.total_count === 0) {
			await this.client.contacts.createUser({
				name: user.name,
				email: user.email,
				externalId: user.id,
			});
		}

		const nowInMs = new Date().getTime();

		await this.client.events.create({
			eventName: name,
			createdAt: Math.floor(nowInMs / 1000),
			userId: user.id,
			metadata,
		});
	};
}
