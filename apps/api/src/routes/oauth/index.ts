import { Hono } from "hono";
import { AppEnv } from "../../utils/types";
import gitlab from "./gitlab";

const oauth = new Hono<AppEnv>();

oauth.route("/gitlab", gitlab);

export default oauth;
