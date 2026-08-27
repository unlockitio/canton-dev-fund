#!/usr/bin/env node

import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import puppeteer from 'puppeteer';

function usage() {
  return 'Usage: npm run bpmn:render -- --input <diagram.bpmn> --output <diagram.svg>';
}

function parseCli() {
  let values;

  try {
    ({ values } = parseArgs({
      options: {
        input: { type: 'string', short: 'i' },
        output: { type: 'string', short: 'o' },
        help: { type: 'boolean', short: 'h' }
      },
      strict: true
    }));
  } catch (error) {
    throw new Error(`${error.message}\n${usage()}`);
  }

  if (values.help) {
    console.log(usage());
    process.exit(0);
  }

  if (!values.input || !values.output) {
    throw new Error(`Both --input and --output are required.\n${usage()}`);
  }

  const input = resolve(values.input);
  const output = resolve(values.output);

  if (input === output) {
    throw new Error('Input and output paths must be different.');
  }

  return { input, output };
}

async function render(input, output) {
  await access(input);
  const xml = await readFile(input, 'utf8');
  const bundle = resolve('node_modules/bpmn-js/dist/bpmn-navigated-viewer.production.min.js');
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><html><body><div id="canvas"></div></body></html>');
    await page.addScriptTag({ path: bundle });

    const result = await page.evaluate(async source => {
      let seed = 0x12345678;
      Math.random = () => {
        seed = (1664525 * seed + 1013904223) >>> 0;
        return seed / 0x100000000;
      };

      const viewer = new window.BpmnJS({ container: '#canvas' });

      try {
        const { warnings } = await viewer.importXML(source);
        const { svg } = await viewer.saveSVG();
        return {
          svg,
          warnings: warnings.map(warning => warning.message ?? String(warning))
        };
      } finally {
        viewer.destroy();
      }
    }, xml);

    if (!result.svg.startsWith('<?xml') || !result.svg.includes('<svg')) {
      throw new Error('bpmn-js returned invalid SVG output.');
    }

    await writeFile(output, `${result.svg.trimEnd()}\n`, { encoding: 'utf8', flag: 'w' });

    for (const warning of result.warnings) {
      console.warn(`bpmn-js warning: ${warning}`);
    }
  } finally {
    await browser.close();
  }
}

try {
  const { input, output } = parseCli();
  await render(input, output);
  console.log(`Rendered ${input} -> ${output}`);
} catch (error) {
  console.error(`BPMN render failed: ${error.message}`);
  process.exitCode = 1;
}
