import { addComponent, createResolver, defineNuxtModule } from "@nuxt/kit";
import { readdirSync } from "fs";
import { join } from "path";

// Module options TypeScript interface definition
export interface ModuleOptions {
  prefix: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-phosphor-icons",
    configKey: "phosphor",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: { prefix: "PhosphorIcon" },
  async setup({ prefix }) {
    const { resolvePath } = createResolver(import.meta.url);

    const entrypoint = await resolvePath("@phosphor-icons/vue");
    const iconsPath = join(entrypoint, "../icons");

    const components = readdirSync(iconsPath).filter((file) =>
      file.endsWith(".vue.mjs")
    );

    const componentChunks = [] as Array<{
      name: string;
      filePath: string;
      chunkName: string;
    }>;
    for (const component of components) {
      let name = component.split(".")[0];

      if (prefix.includes("-"))
        name = name.replace(
          "Ph",
          prefix
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join("")
        );
      else
        name = name.replace(
          "Ph",
          `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)}`
        );

      componentChunks.push({
        name,
        filePath: join(iconsPath, component),
        chunkName: `phosphor-icons/${component.split(".")[0].toLowerCase()}`,
      });
    }

    for (const { name, filePath, chunkName } of componentChunks) {
      addComponent({
        name,
        filePath,
        chunkName,
      });
    }
  },
});
