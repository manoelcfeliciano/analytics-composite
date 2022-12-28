import { LogAnalytics } from '~/protocols/log-analytics';

export class LogAnalyticsComposite implements LogAnalytics {
	constructor(private readonly analytics: LogAnalytics[]) {}

	async log(params: LogAnalytics.Params<unknown>): Promise<void> {
		const errors: unknown[] = [];

		const promises = this.analytics.map(async (analyticsProvider) => {
			try {
				await analyticsProvider.log(params);
			} catch (err) {
				errors.push(err);
			}
		});

		await Promise.all(promises);

		if (errors.length > 0) {
			throw new Error('LogAnalyticsComposite: ' + errors.join(', '));
		}
	}
}
