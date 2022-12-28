import { LogAnalyticsComposite } from '../composite';
import { makeLogPurchaseProvider } from './log-purchase-providers-factory';

export const makeLogAnalyticsComposite = () => {
	const intercom = makeLogPurchaseProvider.intercom();

	return new LogAnalyticsComposite([intercom]);
};
