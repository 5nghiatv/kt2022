import { FileVersion } from './file-version';
/** Options for opening a DBF file. */
export interface OpenOptions {
    /**
     * The behavior to adopt when unsupported file versions or field types are encountered. The following values are
     * supported, with the default being 'strict':
     * - 'strict': when an unsupported file version or field type is encountered, stop reading the file immediately and
     *   issue a descriptive error.
     * - 'loose': ignore unrecognised file versions, unsupported field types, and missing memo files and attempt to
     *   continue reading the file. Any unsupported field types encountered will be present in field descriptors but
     *   missing from read records.
     */
    readMode?: 'strict' | 'loose';
    /** The character encoding(s) to use when reading the DBF file. Defaults to ISO-8859-1. */
    encoding?: Encoding;
    /** Indicates whether deleted records should be included in results when reading records. Defaults to false. */
    includeDeletedRecords?: boolean;
}
/** Options for creating a DBF file. */
export interface CreateOptions {
    /** The file version to create. Currently versions 0x03, 0x83, 0x8b and 0x30 are supported. Defaults to 0x03. */
    fileVersion?: FileVersion;
    /** The character encoding(s) to use when writing the DBF file. Defaults to ISO-8859-1. */
    encoding?: Encoding;
}
/**
 * Character encoding. Either a string, which applies to all fields, or an object whose keys are field names and
 * whose values are encodings. If given as an object, field keys are all optional, but a 'default' key is required.
 * Valid encodings may be found here: https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
 */
export declare type Encoding = string | {
    default: string;
    [fieldName: string]: string;
};
/** Validates the given OpenOptions and substitutes defaults for missing properties. Returns a new options object. */
export declare function normaliseOpenOptions(options: OpenOptions | undefined): Required<OpenOptions>;
/** Validates the given CreateOptions and substitutes defaults for missing properties. Returns a new options object. */
export declare function normaliseCreateOptions(options: CreateOptions | undefined): Required<CreateOptions>;
