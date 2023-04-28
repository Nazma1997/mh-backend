export enum RoleTypes {
    CLIENT = "CLIENT",
    EMPLOYEE = "EMPLOYEE",
    HR = "HR",
    ADMIN = "ADMIN",
    MARKETING = "MARKETING"
};

//get role types
export const getRoleTypes = async (roleType: String) => {
    return roleType && RoleTypes[roleType as keyof typeof RoleTypes] ? RoleTypes[roleType as keyof typeof RoleTypes] : "";
};

//menu permission
export enum MenuPermissions {
    POSITION = "POSITION",
    SKILL = "SKILL",
    SOURCE = "SOURCE",
    CLIENT_LIST = "CLIENT_LIST",
    CLIENT_EMPLOYEE_LIST = "CLIENT_EMPLOYEE_LIST",
    EMPLOYEE_LIST = "EMPLOYEE_LIST",
    MH_EMPLOYEE_LIST = "MH_EMPLOYEE_LIST",
    ADD_MH_EMPLOYEE = "ADD_MH_EMPLOYEE"
};

//get menu permissions
export const getMenuPermissions = async (menuPermission: String) => {
    return menuPermission && MenuPermissions[menuPermission as keyof typeof MenuPermissions] ? MenuPermissions[menuPermission as keyof typeof MenuPermissions] : "";
};