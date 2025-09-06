import "dotenv/config"

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { authRoutes } from './auth/routes.ts';
import { positionsRoutes } from "./positions/routes.ts";
import { usersRoutes} from "./users/routes.js";

export const app = new Hono();
app.use("*", cors({
    origin: "*",  // or restrict to your frontend domain
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
}));


app.get('/', (c) => c.text('Hello Hono!'));


app.route('/auth', authRoutes);
app.route('/positions', positionsRoutes);
app.route('/users',usersRoutes)

if(process.env.NODE_ENV !== 'test') {
    serve(
        {
            fetch: app.fetch,
            port: Number(process.env.PORT) || 3000
        },
        (info) => {
            console.log(`Server running on http://localhost:${info.port}`);
        }
    );
}

