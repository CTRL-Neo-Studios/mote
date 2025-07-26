import {BaseDirectory, exists, mkdir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {useDirs} from "~/composables/utility/useDirs";
import defaultConfig from "~/utils/defaults/defaultConfig";
import type {MoteGeneralConfig} from "~~/types/config.types";

export function useConfigIO() {
    // No Error Catching in IO-Layer Composables.

    const cachedConfig = useState<MoteGeneralConfig>('mote.modules.config.data', () => defaultConfig())
    const GENERAL_CONFIG_FILE = "mote.config.json"

    async function loadOrCreateConfig() {
        await useDirs().initDirs()

        if (await exists(GENERAL_CONFIG_FILE, {baseDir: BaseDirectory.AppConfig})) {
            cachedConfig.value = JSON.parse(await readTextFile(GENERAL_CONFIG_FILE, {baseDir: BaseDirectory.AppConfig})) as MoteGeneralConfig
            return unref(cachedConfig)
        } else {
            const config = defaultConfig()
            await writeToConfig(config)

            return config
        }
    }

    async function writeToConfig(config: MoteGeneralConfig) {
        await writeTextFile(GENERAL_CONFIG_FILE, JSON.stringify(config), {baseDir: BaseDirectory.AppConfig})
    }

    async function resetConfig() {
        await writeToConfig(defaultConfig())
    }

    return {
        loadOrCreateConfig,
        writeToConfig,
        resetConfig,
        config: readonly(cachedConfig),
    }
}