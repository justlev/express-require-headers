export function requireHeaders(headers: Headers, failStatus?: number, failResponseBody?: any) {
    const expectedHeaders = getLowercaseHeaders(headers);
    const headersKeys = Object.keys(expectedHeaders);
    return (req: any, res: any, next: any) => {
        const actualHeaders = getLowercaseHeaders(req.headers);
        const errors = {};
        for (const headerKey of headersKeys) {
            const expectedVal = expectedHeaders[headerKey];
            const actualVal = actualHeaders[headerKey];
            if (expectedVal !== actualVal){
                errors[headerKey] = failResponseBody || `Value ${actualVal} incorrect`;
            }
        }
        if (Object.keys(errors).length > 0){
            res.status(failStatus || 400).send({errors});
            return;
        }
        next();
    }
}

function getLowercaseHeaders(headers: Headers) {
    const keys = Object.keys(headers);
    const res = {};
    for (const key of keys){
        res[key.toLowerCase()] = headers[key];
    }
    return res;
}

export type Headers = {[key: string]: string};
