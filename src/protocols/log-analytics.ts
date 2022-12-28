import { User } from '~/entities/user';

export interface LogAnalytics<P = unknown> {
	log(params: LogAnalytics.Params<P>): Promise<void>;
}

export namespace LogAnalytics {
	export type Params<P> = {
		user: User;
		payload: P;
	};
}
