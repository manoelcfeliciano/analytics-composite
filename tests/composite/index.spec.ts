import { LogAnalyticsComposite } from '../../src/composite/index';
import { LogAnalytics } from '../../src/protocols/log-analytics';
import { LogAnalyticsPurchase } from '../../src/protocols/log-analytics-purchase';

const makeLogAnalyticsStub = () => {
	class LogAnalyticsProviderStub implements LogAnalyticsPurchase {
		async log() {
			return;
		}
	}

	return new LogAnalyticsProviderStub();
};

const makeSut = (analytics: LogAnalytics[]) => {
	const sut = new LogAnalyticsComposite(analytics);

	return { sut };
};

const anyParams = 'any-log-analytics-params' as any;

describe('LogAnalyticsComposite Test', () => {
	test('Should invoke every analytic in constructor', async () => {
		const analytics = Array.from({ length: 3 }).map(() => makeLogAnalyticsStub());
		const analyticsSpies = analytics.map((analytics) => jest.spyOn(analytics, 'log'));
		const { sut } = makeSut(analytics);

		await expect(sut.log(anyParams)).resolves.toBeUndefined();

		analyticsSpies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
	});

	test('Should wait for all log functions to resolve', async () => {
		let resolveCount = 0;

		const updateResolve = () => {
			resolveCount++;
		};

		const analytics = Array.from({ length: 3 }).map(() => {
			const stub = makeLogAnalyticsStub();
			jest.spyOn(stub, 'log').mockImplementation(() => {
				updateResolve();
				return Promise.resolve();
			});

			return stub;
		});

		const { sut } = makeSut(analytics);

		await expect(sut.log(anyParams)).resolves.toBeUndefined();

		expect(resolveCount).toBe(analytics.length);
	});

	test('Should invoke every analytic in constructor with the incoming parameter', async () => {
		const analytics = Array.from({ length: 3 }).map(() => makeLogAnalyticsStub());
		const analyticsSpies = analytics.map((analytics) => jest.spyOn(analytics, 'log'));

		const { sut } = makeSut(analytics);

		await expect(sut.log(anyParams)).resolves.toBeUndefined();

		analyticsSpies.forEach((spy) => {
			expect(spy).toHaveBeenCalledWith(anyParams);
		});
	});

	describe('If one log function throws', () => {
		test('all others will resolve', async () => {
			let resolveCount = 0;

			const updateResolve = () => {
				resolveCount++;
			};

			const err = new Error('any-error');

			const analytics1 = makeLogAnalyticsStub();
			jest.spyOn(analytics1, 'log').mockImplementation(() => {
				updateResolve();
				return Promise.resolve();
			});
			const analytics2 = makeLogAnalyticsStub();
			jest.spyOn(analytics2, 'log').mockImplementation(() => {
				return Promise.reject(err);
			});
			const analytics3 = makeLogAnalyticsStub();
			jest.spyOn(analytics3, 'log').mockImplementation(() => {
				updateResolve();
				return Promise.resolve();
			});

			const analytics: LogAnalytics[] = [analytics1, analytics2, analytics3];

			const { sut } = makeSut(analytics);

			await expect(sut.log(anyParams)).rejects.toBeInstanceOf(Error);

			expect(resolveCount).toBe(2);
		});

		test('all errors should be reported', async () => {
			const err = new Error('any-error');

			const analytics1 = makeLogAnalyticsStub();
			const analytics2 = makeLogAnalyticsStub();
			const analytics3 = makeLogAnalyticsStub();
			jest.spyOn(analytics3, 'log').mockImplementation(() => {
				return Promise.reject(err);
			});

			const analytics: LogAnalytics[] = [analytics1, analytics2, analytics3];

			const { sut } = makeSut(analytics);

			await expect(sut.log(anyParams)).rejects.toBeInstanceOf(Error);
		});
	});
});
