// https://umijs.org/config/
import { defineConfig } from 'umi';
console.log("dev")
export default defineConfig({
    define: {
        "process.env": {
            REACT_APP_ENV: "dev"
        }
    }
});
