jest.mock('~/config/main', () => ({
	config: {
		analytics: {
			intercom: {
				apiKey: undefined,
			},
		},
	},
}));
