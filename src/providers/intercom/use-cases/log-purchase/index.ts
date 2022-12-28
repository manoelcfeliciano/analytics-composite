import { IntercomAnalytics } from '../../../../protocols/intercom';
import { LogAnalyticsPurchase } from '../../../../protocols/log-analytics-purchase';

export class IntercomLogPurchase implements LogAnalyticsPurchase {
	private readonly eventName = 'made purchase';

	constructor(private readonly intercom: IntercomAnalytics) {}

	log = (params: LogAnalyticsPurchase.Params) => {
		return this.intercom.report(this.eventName, {
			user: params.user,
			metadata: {
				affiliation: 'web_checkout',
				item_category: 'purchase',
				item_variant: 'default',
				price: {
					amount: params.payload.payment.price * 100,
					currency: params.payload.payment.currency,
				},
			},
		});
	};
}
