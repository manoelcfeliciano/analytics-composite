import { LogAnalytics } from './log-analytics';

export type LogAnalyticsPurchase = LogAnalytics<LogAnalyticsPurchase.Body>;

export namespace LogAnalyticsPurchase {
	export interface Body {
		readonly payment: Payment;
	}

	export interface Payment {
		readonly price: number;
		readonly currency: string;
	}

	export type Params = LogAnalytics.Params<Body>;
}
