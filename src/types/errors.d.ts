export interface SparkPostError extends Error {

    name: string;
    errors?: any;
    statusCode?: number;
}
