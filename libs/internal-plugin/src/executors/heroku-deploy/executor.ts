import { execSync } from 'child_process';
import { HerokuDeployExecutorSchema } from './schema';

export default async function runExecutor(schema: HerokuDeployExecutorSchema) {
  const cwd = schema.distLocation;
  execSync(`heroku container:login`, { cwd });
  execSync(`heroku container:push web --app ${schema.herokuAppName}`, { cwd });
  execSync(`heroku container:release web --app ${schema.herokuAppName}`, {
    cwd,
  });
  return {
    success: true,
  };
}
