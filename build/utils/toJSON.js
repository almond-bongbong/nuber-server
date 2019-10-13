"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (object) {
    var proto = Object.getPrototypeOf(object);
    var jsonObj = Object.assign({}, object);
    Object.entries(Object.getOwnPropertyDescriptors(proto))
        .filter(function (_a) {
        var _ = _a[0], descriptor = _a[1];
        return typeof descriptor.get === 'function';
    })
        .forEach(function (_a) {
        var key = _a[0], descriptor = _a[1];
        if (descriptor && key[0] !== '_') {
            try {
                jsonObj[key] = object[key];
            }
            catch (error) {
                console.error("Error calling getter " + key, error);
            }
        }
    });
    return jsonObj;
});
//# sourceMappingURL=toJSON.js.map