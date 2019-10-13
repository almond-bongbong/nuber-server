"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var createJWT = function (id) { return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET || ''); };
exports.default = createJWT;
//# sourceMappingURL=createJWT.js.map