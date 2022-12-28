import { IntercomLogPurchase } from '../../../../../src/providers/intercom/use-cases/log-purchase/index';
import { IntercomAnalytics } from '../../../../../src/protocols/intercom';
import { makeFakeUser } from '~/../tests/utils/factories/user';
import { faker } from '@faker-js/faker';

const PURCHASE_EVENT_NAME = 'made purchase';

export const makeFakeParams = (params?: Partial<IntercomAnalytics.Params>) => {
	const user = makeFakeUser();

	return {
		payload: {
			payment: {
				price: faker.datatype.number({ min: 0 }),
				currency: 'BRL',
				coupon: null,
			},
			campaign: null,
		},
		user,
	};
};

const makeIntercomLogPurchaseStub = (): IntercomAnalytics => {
	class IntercomLogPurchaseStub implements IntercomAnalytics {
		async report(name: string, params: IntercomAnalytics.Params): Promise<void> {
			return;
		}
	}

	return new IntercomLogPurchaseStub();
};

const makeSut = () => {
	const stubs = {
		intercom: makeIntercomLogPurchaseStub(),
	};

	const sut = new IntercomLogPurchase(stubs.intercom);

	return { sut, stubs };
};

describe('IntercomPurchaseSubscription Test', () => {
	test('Should report to intercom once', async () => {
		const { sut, stubs } = makeSut();

		const reportSpy = jest.spyOn(stubs.intercom, 'report');

		await sut.log(makeFakeParams());

		expect(reportSpy).toHaveBeenCalledTimes(1);
	});

	test('Should wait for intercom.report to resolve', async () => {
		const { sut, stubs } = makeSut();

		let resolved = false;
		jest.spyOn(stubs.intercom, 'report').mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					setImmediate(() => {
						resolved = true;
						resolve();
					});
				})
		);
		await sut.log(makeFakeParams());
		expect(resolved).toBe(true);
	});

	test('Should call intercom.report with correct parameters', async () => {
		const { sut, stubs } = makeSut();

		const params = makeFakeParams();
		const metadata = {
			affiliation: 'web_checkout',
			item_category: 'purchase',
			item_variant: 'default',
			price: {
				amount: params.payload.payment.price * 100,
				currency: params.payload.payment.currency,
			},
		};

		const reportSpy = jest.spyOn(stubs.intercom, 'report');

		await sut.log(params);
		expect(reportSpy).toHaveBeenCalledWith(PURCHASE_EVENT_NAME, {
			user: params.user,
			metadata,
		});
	});
});
