import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
const globby = require('globby');
export function getAllWorkspaces() {
    try {
        const configPath = path.join(process.cwd(), 'pnpm-workspace.yaml');
        const file = fs.readFileSync(configPath, 'utf8');
        const {packages} = YAML.parse(file);

        return globby.sync(packages, {onlyDirectories: true});
    } catch (error) {
        return [];
    }
}
