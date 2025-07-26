import {exists, mkdir} from "@tauri-apps/plugin-fs";
import {BaseDirectory} from "@tauri-apps/api/path";

export function useDirs() {
    async function initDirs() {
        if(!(await exists('', {baseDir: BaseDirectory.AppData})))
            await mkdir('', {baseDir: BaseDirectory.AppData})

        if(!(await exists('', {baseDir: BaseDirectory.AppConfig})))
            await mkdir('', {baseDir: BaseDirectory.AppConfig})
    }

    /**
     * Joins all given path segments together using the platform-specific separator as a delimiter,
     * then normalizes the resulting path.
     *
     * @param {...string[]} paths - The path segments to join
     * @returns {Promise<string>} A promise that resolves with the joined and normalized path
     *
     * @example
     * ```typescript
     * const path = await join('users', 'tauri', 'avatar.png');
     * console.log(path); // On Windows: "users\tauri\avatar.png", On Unix: "users/tauri/avatar.png"
     * ```
     */
    async function join(...paths: string[]): Promise<string> {
        // Determine platform-specific separator
        const separator = isWindows() ? '\\' : '/';

        // Filter out empty segments and normalize each segment
        const normalizedSegments = paths
            .filter(segment => segment !== '')
            .map(segment => {
                // Replace all slashes with platform-specific separator
                let normalized = segment.replace(/[\\/]+/g, separator);
                // Remove trailing separator unless it's the root
                if (normalized.endsWith(separator) && normalized !== separator) {
                    normalized = normalized.slice(0, -1);
                }
                return normalized;
            });

        // Join segments with platform separator
        let joinedPath = normalizedSegments.join(separator);

        // Handle absolute paths
        if (paths[0]?.startsWith(separator) || (isWindows() && paths[0]?.match(/^[a-zA-Z]:[\\/]/))) {
            // Ensure we preserve the root slash on Unix or drive letter on Windows
            if (isWindows()) {
                const driveMatch = paths[0].match(/^([a-zA-Z]:)[\\/]/);
                if (driveMatch) {
                    joinedPath = driveMatch[1] + separator + joinedPath.slice(driveMatch[0].length);
                }
            } else {
                joinedPath = separator + joinedPath;
            }
        }

        // Normalize the path (resolve . and .. segments)
        return normalizePath(joinedPath);
    }

    /**
     * Helper function to detect Windows platform
     */
    function isWindows(): boolean {
        return typeof process !== 'undefined'
            ? process.platform === 'win32'
            : navigator.platform.includes('Win');
    }

    /**
     * Normalizes a path by resolving . and .. segments
     * @param path The path to normalize
     * @returns The normalized path
     */
    function normalizePath(path: string): string {
        const separator = isWindows() ? '\\' : '/';
        const segments = path.split(separator);
        const result: string[] = [];

        for (const segment of segments) {
            if (segment === '.') {
                continue;
            } else if (segment === '..') {
                if (result.length > 0 && result[result.length - 1] !== '..') {
                    result.pop();
                } else {
                    result.push('..');
                }
            } else if (segment !== '') {
                result.push(segment);
            }
        }

        // Handle edge cases
        let normalized = result.join(separator);
        if (path.startsWith(separator)) {
            normalized = separator + normalized;
        }
        if (path.endsWith(separator) && !normalized.endsWith(separator)) {
            normalized += separator;
        }

        return normalized || '.';
    }

    return {
        initDirs,
        join,
        isWindows,
        normalizePath
    }
}