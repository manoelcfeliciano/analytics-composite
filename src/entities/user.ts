export interface User {
	/**
	 * The user's ID
	 *
	 * [unique]
	 */
	readonly id: string;

	/**
	 * User's name
	 */
	readonly name: string;

	/**
	 * User's email
	 *
	 * [unique]
	 */
	readonly email: string;
}
