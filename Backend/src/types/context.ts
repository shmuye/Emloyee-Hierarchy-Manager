export type JwtUserPayload = {
    id: string;
    email: string;
    role: "OrgAdmin" | "User";
};

declare module "hono" {
    interface ContextVariableMap {
        user: JwtUserPayload;
    }
}
