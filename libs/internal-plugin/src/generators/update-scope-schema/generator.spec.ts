import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  generatorGenerator,
  pluginGenerator,
} from '@nrwl/nx-plugin/generators';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from '@nrwl/linter';
import generator from './generator';

describe.skip('update-scope-schema generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await addUtilLibProject(appTree);
    await libraryGenerator(appTree, { name: 'foo', tags: 'scope:foo' });
    await libraryGenerator(appTree, { name: 'bar', tags: 'scope:bar' });
  });

  it('should adjust the util-lib generator based on existing projects', async () => {
    await generator(appTree);
    const schemaJson = readJson(
      appTree,
      'libs/internal-plugin/src/generators/util-lib/schema.json'
    );
    expect(schemaJson.properties.directory['x-prompt'].items).toEqual([
      {
        value: 'foo',
        label: 'foo',
      },
      {
        value: 'bar',
        label: 'bar',
      },
    ]);
    const schemaInterface = appTree.read(
      'libs/internal-plugin/src/generators/util-lib/schema.d.ts',
      'utf-8'
    );
    expect(schemaInterface).toContain(`export interface UtilLibGeneratorSchema {
  name: string;
  directory: 'foo' | 'bar';
}`);
  });
});

async function addUtilLibProject(tree: Tree) {
  await pluginGenerator(tree, {
    name: 'internal-plugin',
    skipTsConfig: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    compiler: 'tsc',
    skipFormat: false,
    skipLintChecks: false,
    minimal: true,
  });
  await generatorGenerator(tree, {
    name: 'util-lib',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });
  const filesToCopy = [
    '../util-lib/generator.ts',
    '../util-lib/schema.json',
    '../util-lib/schema.d.ts',
  ];
  for (const file of filesToCopy) {
    tree.write(
      `libs/internal-plugin/src/generators/util-lib/${file}`,
      readFileSync(join(__dirname, file))
    );
  }
}
