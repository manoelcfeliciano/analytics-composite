import './mocks/without-api-key-mocks';
import { run as sut } from '../../src/main';

describe('Main', () => {
	describe('Should run properly and log the expected info', () => {
		test('when api key is not defined for Intercom', async () => {
			const logSpy = jest.spyOn(global.console, 'log');

			await sut();

			expect(logSpy.mock.calls[0][0]).toStrictEqual('Logging purchase...');
			expect(logSpy.mock.calls[1][0]).toStrictEqual(
				'You haven`t setup an API token for Intercom. Skipping event logging...'
			);
			expect(logSpy.mock.calls[2][0]).toStrictEqual('Done!');

			logSpy.mockRestore();
		});
	});
});
