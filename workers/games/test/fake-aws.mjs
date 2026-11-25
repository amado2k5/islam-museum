#!/usr/bin/env node
// A stand-in for the AWS CLI, for the rehearsal in publish-e2e.test.mjs: `aws s3 cp` between local paths and
// s3://<bucket>/<key>, where the "bucket" is the folder named by FAKE_S3_ROOT. It understands only the calls the
// games publisher makes, logs every call to FAKE_S3_LOG, and fails on anything else, so a new kind of call cannot
// pass the rehearsal unnoticed. It is a simulation: the first real proof is a UAT deploy.
import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const args = process.argv.slice(2);
appendFileSync(process.env.FAKE_S3_LOG, `${JSON.stringify(args)}\n`);
const die = (message, code = 1) => {
  process.stderr.write(`${message}\n`);
  process.exit(code);
};
if (args[0] !== "s3" || args[1] !== "cp") die(`fake aws: only "s3 cp" is allowed, got ${args.slice(0, 2).join(" ")}`, 2);
const flags = { recursive: false, exclude: [] };
const positional = [];
for (let i = 2; i < args.length; i++) {
  const a = args[i];
  if (a === "--recursive") flags.recursive = true;
  else if (a === "--only-show-errors") continue;
  else if (a === "--exclude") flags.exclude.push(args[++i]);
  else if (["--endpoint-url", "--content-type", "--cache-control"].includes(a)) i++;
  else if (a.startsWith("--")) die(`fake aws: unknown option ${a}`, 2);
  else positional.push(a);
}
const [src, dst] = positional;
const local = (address) => {
  if (!address.startsWith("s3://")) return address;
  const [, bucket, key] = address.match(/^s3:\/\/([^/]+)\/(.*)$/);
  if (bucket !== process.env.FAKE_S3_BUCKET) die(`fake aws: unexpected bucket ${bucket}`, 2);
  return join(process.env.FAKE_S3_ROOT, key);
};
const from = local(src);
if (dst === "-") {
  if (!existsSync(from) || !statSync(from).isFile()) die(`fatal error: An error occurred (404) when calling the HeadObject operation: Key "${src}" does not exist`);
  process.stdout.write(readFileSync(from));
  process.exit(0);
}
const to = local(dst);
if (flags.recursive) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  if (!existsSync(from)) process.exit(0);
  for (const file of walk(from)) {
    const rel = relative(from, file);
    if (flags.exclude.includes(rel)) continue;
    mkdirSync(dirname(join(to, rel)), { recursive: true });
    cpSync(file, join(to, rel));
  }
} else {
  if (!existsSync(from)) die(`The user-provided path ${src} does not exist.`, 255);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}
