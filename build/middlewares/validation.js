"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSignUp = void 0;
const zod_1 = require("zod");
const schemaObj = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
const validateUserSignUp = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        yield schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const theExpectedErrorMessage = error.errors.map((error) => error.message);
            return res.status(400).json({
                message: theExpectedErrorMessage[0]
            });
        }
        res.status(500).json({
            message: error.message,
            status: "Zod Failure"
        });
    }
});
exports.validateUserSignUp = validateUserSignUp;
