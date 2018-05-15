export declare interface OperationResult {
    Success: boolean;
}

export declare interface DataOperationResult<T> {
    Success: boolean;
    Data: T;
}

export declare interface CreateOperationResult extends OperationResult {
    Id: string;
}

export default OperationResult;