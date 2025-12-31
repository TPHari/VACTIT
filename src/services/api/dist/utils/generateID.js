"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrialId = generateTrialId;
const crypto_1 = require("crypto");
function generateTrialId() {
    return (0, crypto_1.randomUUID)();
}
