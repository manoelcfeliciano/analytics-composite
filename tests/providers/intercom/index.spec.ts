import { Client } from 'intercom-client';
import MockDate from 'mockdate';
import { IntercomAnalyticsProviderAdapter } from '../../../src/providers/intercom/index';
import { makeFakeUser } from '../../utils/factories/user';

jest.mock('intercom-client', () => ({
	Client: class _Client {
		static __instance = jest.fn();
		static __createEvent = jest.fn();
		static __createUser = jest.fn();
		static __search = jest.fn();
		static clear = () => {
			_Client.__instance.mockClear();
			_Client.__createEvent.mockClear();
		};

		constructor(...args: any[]) {
			_Client.__instance(...args);
		}

		public events = {
			create: _Client.__createEvent,
		};

		public contacts = {
			search: _Client.__search,
			createUser: _Client.__createUser,
		};
	},
	Operators: {
		AND: 'AND',
	},
}));

type SutPayload = {
	token?: string;
};

const makeSut = (payload?: SutPayload) => {
	const stubs = {
		token: payload?.token === undefined ? 'valid_token' : payload.token,
	};

	const sut = new IntercomAnalyticsProviderAdapter(stubs.token);

	return {
		sut,
		stubs,
	};
};

describe('IntercomAnalyticsProviderAdapter Test', () => {
	const now = new Date();

	beforeAll(() => {
		MockDate.set(now);
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should instantiate Intercom Client with proper authentication', () => {
		const constructorSpy = jest.spyOn(Client as any, '__instance');

		const { stubs } = makeSut();

		expect(constructorSpy).toHaveBeenCalledWith({ tokenAuth: { token: stubs.token } });
	});

	test('Should return null without doing nothing if client is not instantiated', async () => {
		const constructorSpy = jest.spyOn(Client as any, '__instance');

		const fake = {
			event: 'any_event',
			params: {
				user: 'valid_user' as any,
				metadata: 'any_metadata' as any,
			},
		};

		const { sut, stubs } = makeSut({ token: null });

		expect(constructorSpy).not.toHaveBeenCalled();

		const createUserSpy = jest.spyOn(Client as any, '__createUser');

		const createEventSpy = jest.spyOn(Client as any, '__createEvent');

		await expect(sut.report(fake.event, fake.params)).resolves.not.toThrow();

		expect(createUserSpy).not.toHaveBeenCalled();
		expect(createEventSpy).not.toHaveBeenCalled();
	});

	test('Should call intercom contacts createUser with proper params', async () => {
		const { sut } = makeSut();
		const fake = {
			event: 'any_event',
			params: {
				user: 'valid_user' as any,
				metadata: 'any_metadata' as any,
			},
		};

		jest.spyOn(Client as any, '__search').mockResolvedValue({ total_count: 0 });
		const createUserSpy = jest.spyOn(Client as any, '__createUser');

		await expect(sut.report(fake.event, fake.params)).resolves.not.toThrow();

		expect(createUserSpy).toHaveBeenCalledWith({
			name: fake.params.user.name,
			email: fake.params.user.email,
			externalId: fake.params.user.uuid,
		});
	});

	test('Should call intercom contacts createEvent with proper params', async () => {
		const { sut } = makeSut();
		const mockUser = makeFakeUser();
		const fake = {
			event: 'any_event',
			params: {
				user: mockUser,
				metadata: 'any_metadata' as any,
			},
		};

		jest.spyOn(Client as any, '__search').mockResolvedValue({ total_count: 1 });
		const createEventSpy = jest.spyOn(Client as any, '__createEvent');

		await expect(sut.report(fake.event, fake.params)).resolves.not.toThrow();

		expect(createEventSpy).toHaveBeenCalledWith({
			eventName: fake.event,
			createdAt: Math.floor(now.getTime() / 1000),
			userId: mockUser.id,
			metadata: fake.params.metadata,
		});
	});
});
