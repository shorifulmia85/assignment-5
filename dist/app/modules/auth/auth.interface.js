"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var IStatus;
(function (IStatus) {
    IStatus["ACTIVE"] = "ACTIVE";
    IStatus["INACTIVE"] = "INACTIVE";
    IStatus["BLOCKED"] = "BLOCKED";
})(IStatus || (exports.IStatus = IStatus = {}));
