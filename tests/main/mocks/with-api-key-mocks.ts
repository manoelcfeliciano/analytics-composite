const searchIntercomSpy = jest.fn().mockImplementation(() => ({ total_count: 0 }));

export const sut = async () => {
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
	const { run } = await require('../../../src/main');

	return run();
};

jest.mock('~/config/main', () => ({
	config: {
		analytics: {
			intercom: {
				apiKey: 'valid-api-key',
			},
		},
	},
}));
