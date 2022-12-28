import { config } from '~/config/main';
import { IntercomAnalyticsProviderAdapter } from '~/providers/intercom';
import { IntercomLogPurchase } from '~/providers/intercom/use-cases/log-purchase';

export const makeLogPurchaseProvider = {
	intercom: () => {
		console.log(config);
		const intercom = new IntercomAnalyticsProviderAdapter(config.analytics.intercom.apiKey);
		return new IntercomLogPurchase(intercom);
	},
};
