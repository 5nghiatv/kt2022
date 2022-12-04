"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidFileVersion = void 0;
function isValidFileVersion(fileVersion) {
    return [0x03, 0x83, 0x8b, 0x30].includes(fileVersion);
}
exports.isValidFileVersion = isValidFileVersion;
//# sourceMappingURL=file-version.js.map