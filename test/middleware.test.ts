import {requireHeaders} from "../src";

describe('requireHeaders middleware', () => {
    const nextFn = jest.fn();
    const response = {send: jest.fn(), status: jest.fn()};

    const expectedHeaders = {
        'X-AUTH-TOKEN': 'SUPER_SECRET_AUTH_TOKEN',
        'X-ANOTHER-HEADER': '12345',
    };
    let middleware = requireHeaders(expectedHeaders);

    beforeEach(() => {
        nextFn.mockClear();
        response.send.mockClear();
        response.status.mockClear();
        response.send.mockReturnValue(response);
        response.status.mockReturnValue(response);
    });

    describe('headers match', () => {
        const actualHeaders = {...expectedHeaders};
        test('does not end request', () => {
            middleware({headers: actualHeaders}, response, nextFn);

            expect(response.send).toBeCalledTimes(0);
            expect(response.status).toBeCalledTimes(0);
        });

        test('it calls the next function', () => {
            middleware({headers: actualHeaders}, response, nextFn);

            expect(nextFn).toBeCalled();
        });
    });

    describe('headers partially match', () => {
        const actualHeaders = {...expectedHeaders, 'X-ANOTHER-HEADER': 'SomeOtherVal'};
        test('it does not call the next function', () => {
            middleware({headers: actualHeaders}, response, nextFn);

            expect(nextFn).toBeCalledTimes(0);
        });

        test('it sends a default failure response', () => {
            middleware({headers: actualHeaders}, response, nextFn);

            expect(response.send.mock.calls).toEqual([
                [{errors: {'X-ANOTHER-HEADER': `Value SomeOtherVal incorrect`}}]
            ]);
            expect(response.status.mock.calls).toEqual([
                [400]
            ]);
        });
    });

    describe('headers do not match at all', () => {
        const actualHeaders = {zim: 'zam'};

        test('it sends a default failure response', () => {
            middleware({headers: actualHeaders}, response, nextFn);

            expect(response.status.mock.calls).toEqual([
                [400]
            ]);
            expect(response.send.mock.calls).toEqual([
                [
                    {
                        errors:
                            {
                                'X-AUTH-TOKEN': `Value undefined incorrect`,
                                'X-ANOTHER-HEADER': `Value undefined incorrect`
                            }
                    }
                ]
            ]);
        });

        describe('a specified error response', () => {
            test('it returns the specified response', () => {

                const modifiedMiddleware = requireHeaders(expectedHeaders, 401, 'SomeError');
                modifiedMiddleware({headers: actualHeaders}, response, nextFn);


                expect(response.status.mock.calls).toEqual([
                    [401]
                ]);

                expect(response.send.mock.calls).toEqual([
                    [
                        {
                            errors:
                                {
                                    'X-AUTH-TOKEN': `SomeError`,
                                    'X-ANOTHER-HEADER': `SomeError`
                                }
                        }
                    ]
                ]);
            });
        });
    });
});
