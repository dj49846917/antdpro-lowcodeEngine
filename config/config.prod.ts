// https://umijs.org/config/
import { defineConfig } from 'umi';
export default defineConfig({
    define: {
        "process.env": {
            REACT_APP_ENV: "prod"
        }
    }
});
