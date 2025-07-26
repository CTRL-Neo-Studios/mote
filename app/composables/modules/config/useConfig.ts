import type {MoteGeneralConfig} from "~~/types/config.types";
import {useConfigIO} from "~/composables/modules/config/useConfigIO";
import defaultConfig from "~/utils/defaults/defaultConfig";

export function useConfig() {
    const $io = useConfigIO()

    const $config = useState<MoteGeneralConfig | null>(() => null)

    async function loadConfig() {
        $config.value = await $io.loadOrCreateConfig()
    }

    async function saveConfig() {
        await $io.writeToConfig(unref($config) || defaultConfig())
    }

    async function resetConfig() {
        await $io.resetConfig()
    }

    return {
        loadConfig,
        saveConfig,
        resetConfig,
        configRef: $config
    }
}