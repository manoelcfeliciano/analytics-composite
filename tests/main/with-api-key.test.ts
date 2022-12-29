import './mocks/with-api-key-mocks';
import { sut } from './mocks/with-api-key-mocks';

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
