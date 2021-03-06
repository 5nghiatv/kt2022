/** Metadata describing a single field in a DBF file. */
export interface FieldDescriptor {
    /** The name of the field. Must be no longer than 10 characters. */
    name: string;
    /**
     * The single-letter code for the field type.
     * C=string, N=numeric, F=float, L=logical, D=date, I=integer, M=memo, T=datetime, B=double.
     */
    type: 'C' | 'N' | 'F' | 'L' | 'D' | 'I' | 'M' | 'T' | 'B';
    /** The size of the field in bytes. */
    size: number;
    /** The number of decimal places. Optional; only used for some field types. */
    decimalPlaces?: number;
}
export declare function validateFieldDescriptor(field: FieldDescriptor, fileVersion: number): void;
