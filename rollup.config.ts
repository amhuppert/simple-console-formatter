import typescript from "@rollup/plugin-typescript";
import { RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";
import thisPackage from "./package.json" assert { type: "json" };

const config: RollupOptions[] = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/cjs/index.js",
        format: "cjs",
        sourcemap: true,
        name: thisPackage.name,
      },
      {
        file: "dist/esm/index.js",
        format: "esm",
        sourcemap: true,
        name: thisPackage.name,
      },
    ],
    plugins: [typescript(), terser()],
  },
  {
    input: "dist/esm/types/src/index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
  },
];

export default config;
