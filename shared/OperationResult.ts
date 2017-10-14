export interface OperationResult {
    Success: boolean;
}

export interface CreateOperationResult extends OperationResult {
    Id: string;
}

export default OperationResult;