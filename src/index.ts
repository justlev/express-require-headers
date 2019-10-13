export function requireHeaders(expectedHeaders: Headers, failStatus?: number, failResponseBody?: any) {
    return (req: any, res: any, next: any) => {
        const headersKeys = Object.keys(expectedHeaders);
        const errors = {};
        for (const headerKey of headersKeys) {
            const expectedVal = expectedHeaders[headerKey];
            const actualVal = req.headers[headerKey];
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

export type Headers = {[key: string]: string};
