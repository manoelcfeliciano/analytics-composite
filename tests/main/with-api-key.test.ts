const searchIntercomSpy = jest.fn().mockImplementation(() => ({ total_count: 0 }));

const sut = async () => {
	jest.mock('intercom-client', () => {
		return {
			Client: function () {
				return {
					contacts: { search: searchIntercomSpy, createUser: jest.fn() },
					events: { create: jest.fn() },
				};
			},
			Operators: { And: 'and' },
		};
	});
	const { run } = await require('../../src/main');

	return run();
};

jest.mock('~/config/main', () => ({
	config: {
		analytics: {
			intercom: {
				apiKey: '123',
			},
		},
	},
}));

describe('Main', () => {
	describe('Should run properly and log the expected info', () => {
		test('when api key is defined for Intercom', async () => {
			const logSpy = jest.spyOn(global.console, 'log');

			await sut();

			expect(logSpy.mock.calls[0][0]).toStrictEqual('Logging purchase...');
			expect(logSpy.mock.calls[1][0]).toStrictEqual('Done!');
		});
	});
});
