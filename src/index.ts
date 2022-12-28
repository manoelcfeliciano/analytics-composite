import './config/setup-env';
import { makeLogAnalyticsComposite } from './factories/log-analytics-composite-factory';

const analytics = makeLogAnalyticsComposite();

const run = async () => {
	console.log('Logging purchase...');

	await analytics.log({
		payload: {
			payment: {
				price: 100,
				currency: 'BRL',
			},
		},
		user: {
			id: 'user_id',
			email: 'user_email',
			name: 'user_name',
		},
	});

	console.log('Done!');
};

run();
