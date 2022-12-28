import { config } from '../config/main';
import { LogAnalyticsComposite } from '../composite';
import { IntercomAnalyticsProviderAdapter } from '../providers/intercom';
import { IntercomLogPurchase } from '../providers/intercom/use-cases/log-purchase';

const makeLogPurchaseProvider = {
	intercom: () => {
		const intercom = new IntercomAnalyticsProviderAdapter(config.analytics.intercom.apiKey);
		return new IntercomLogPurchase(intercom);
	},
};

export const makeLogAnalyticsComposite = () => {
	const intercom = makeLogPurchaseProvider.intercom();

	return new LogAnalyticsComposite([intercom]);
};
