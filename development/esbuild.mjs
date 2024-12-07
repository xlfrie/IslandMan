import * as esbuild from "esbuild";
import * as fs from "node:fs";
import * as os from "node:os";
import * as pkg from "../package.json" with { type: "json" };
import { reload } from './websocket.mjs';

const minecraftDirectory = `C:\\Users\\${
    os.userInfo().username
}\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang`;
const packageName = pkg.default.name;

const watch = async () => {
    const ctx = await esbuild.context({
        entryPoints: ["src/main/index.ts"],
        bundle: true,
        outfile: "dist/scripts/index.js",
        external: Object.keys(pkg.default.dependencies),
        format: "esm",
        sourcemap: "external",
        plugins: [
            {
                name: "minecraft-deploy",
                setup(build) {
                    build.onEnd((res) => {
                        if (!fs.existsSync("./dist")) {
                            fs.mkdirSync("./dist")
                        }

                        fs.readdir("./behavior_pack", (err, files) => {
                            for (const file of files) {
                                fs.cpSync(
                                    "./behavior_pack/" + file,
                                    "./dist/" + file,
                                    { recursive: true }
                                );
                            }
                        });

                        fs.readdir("./dist", (err, files) => {
                            for (const file of files) {
                                fs.cpSync(
                                    "./dist/" + file,
                                    `${minecraftDirectory}\\development_behavior_packs\\${packageName}\\${file}`,
                                    { recursive: true }
                                );
                            }
                        });

                        fs.readdir("./resource_pack", (err, files) => {
                            for (const file of files) {
                                fs.cpSync(
                                    "./resource_pack/" + file,
                                    `${minecraftDirectory}\\development_resource_packs\\${packageName}\\${file}`,
                                    {
                                        recursive: true,
                                    }
                                );
                            }
                        });

                        reload();
                    });
                },
            },
        ],
    });

    await ctx.watch();

    console.log('Watching. Run "/wsserver ws://localhost:3000" for reloading');
};

watch();
