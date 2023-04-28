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
exports.getMenuPermissions = exports.MenuPermissions = exports.getRoleTypes = exports.RoleTypes = void 0;
var RoleTypes;
(function (RoleTypes) {
    RoleTypes["CLIENT"] = "CLIENT";
    RoleTypes["EMPLOYEE"] = "EMPLOYEE";
    RoleTypes["HR"] = "HR";
    RoleTypes["ADMIN"] = "ADMIN";
    RoleTypes["MARKETING"] = "MARKETING";
})(RoleTypes = exports.RoleTypes || (exports.RoleTypes = {}));
;
//get role types
const getRoleTypes = (roleType) => __awaiter(void 0, void 0, void 0, function* () {
    return roleType && RoleTypes[roleType] ? RoleTypes[roleType] : "";
});
exports.getRoleTypes = getRoleTypes;
//menu permission
var MenuPermissions;
(function (MenuPermissions) {
    MenuPermissions["POSITION"] = "POSITION";
    MenuPermissions["SKILL"] = "SKILL";
    MenuPermissions["SOURCE"] = "SOURCE";
    MenuPermissions["CLIENT_LIST"] = "CLIENT_LIST";
    MenuPermissions["CLIENT_EMPLOYEE_LIST"] = "CLIENT_EMPLOYEE_LIST";
    MenuPermissions["EMPLOYEE_LIST"] = "EMPLOYEE_LIST";
    MenuPermissions["MH_EMPLOYEE_LIST"] = "MH_EMPLOYEE_LIST";
    MenuPermissions["ADD_MH_EMPLOYEE"] = "ADD_MH_EMPLOYEE";
})(MenuPermissions = exports.MenuPermissions || (exports.MenuPermissions = {}));
;
//get menu permissions
const getMenuPermissions = (menuPermission) => __awaiter(void 0, void 0, void 0, function* () {
    return menuPermission && MenuPermissions[menuPermission] ? MenuPermissions[menuPermission] : "";
});
exports.getMenuPermissions = getMenuPermissions;
