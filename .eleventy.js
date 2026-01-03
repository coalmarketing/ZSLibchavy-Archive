// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const { I18nPlugin } = require("@11ty/eleventy");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");
const configI18n = require("./src/config/plugins/i18n");

// 🔧 Processing Functions
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const filterStripHtml = require("./src/config/filters/stripHtml");
const filterStripMarkdown = require("./src/config/filters/stripMarkdown");
const isProduction = process.env.ELEVENTY_ENV === "PROD";


module.exports = function (eleventyConfig) {
    /*
     * 🚫 Ignore Heavy CMS Content During Development
     * Prevents Eleventy from rebuilding large migrated directories on each save.
     * - Improves dev server speed and reduces unnecessary rebuilds
     * - These folders are included again automatically in production builds
     */
    if (!isProduction) {
        eleventyConfig.ignores.add("./src/content/cms/akce");
        //eleventyConfig.ignores.add("./src/content/cms/aktuality");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // LANGUAGES
    // Using Eleventy's build events to process non-template languages
    // Learn more: https://www.11ty.dev/docs/events/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * JavaScript Processing
     * These processors handle bundling, transpiling, and minification
     * - JavaScript: Compiled with esbuild for modern bundling
     */
    eleventyConfig.on("eleventy.after", javascript);

    // ═════════════════════════════════════════════════════════════════════════
    // PLUGINS
    // Extend Eleventy with additional functionality
    // Learn more: https://www.11ty.dev/docs/plugins/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 🖼️ Image Optimization
     * Resize and optimize images for better performance using {% getUrl %}
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
     */
    eleventyConfig.addPlugin(pluginImages, configImages);

    /*
     * 🧭 Navigation Plugin
     * Enables hierarchical navigation structure via front matter
     * Documentation: https://www.11ty.dev/docs/plugins/navigation/
     */
    eleventyConfig.addPlugin(pluginNavigation);

    /*
     * 🗺️ Sitemap Generation
     * Creates sitemap.xml automatically using domain from _data/client.json
     * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
     */
    eleventyConfig.addPlugin(I18nPlugin, configI18n);

    /*
     * 📦 Production Minification
     * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
     * Only runs during production builds (npm run build)
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
     */
    if (isProduction) {
        eleventyConfig.addPlugin(pluginMinifier);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PASSTHROUGH COPIES
    // Copy files directly to output without processing
    // Learn more: https://www.11ty.dev/docs/copy/
    // ═════════════════════════════════════════════════════════════════════════

    eleventyConfig.addPassthroughCopy("./src/assets"); // Static assets
    eleventyConfig.addPassthroughCopy("./src/admin"); // CMS admin files
    eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

    // ═════════════════════════════════════════════════════════════════════════
    // FILTERS
    // Transform data in templates at build time
    // Learn more: https://www.11ty.dev/docs/filters/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📅 Human-Readable Date Formatting Filter
     * Converts JavaScript dates to human-readable format
     * Usage: {{ "2023-12-02" | postDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("postDate", filterPostDate);

    /*
     * 📅 ISO Date Formatting Filter
     * Converts JavaScript dates to ISO 8601 format
     * Usage: {{ "2023-12-02" | isoDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("isoDate", filterIsoDate);

    /**
     * 🧹 HTML Stripping Filter
     * Removes all HTML tags and decodes HTML entities in a string.
     *
     * Useful for generating plaintext excerpts, meta descriptions, RSS text,
     * or anywhere HTML markup should be removed.
     * 
     * Usage: {{ content | stripHtml }}
     */
    eleventyConfig.addFilter("stripHtml", filterStripHtml);

    /**
     * 📝 Markdown Stripping Filter
     * Removes common Markdown syntax such as headings, emphasis,
     * links, images, code blocks, and inline code, returning clean plaintext.
     *
     * Ideal for excerpts, meta descriptions, search indexing, or anywhere
     * Markdown formatting should be removed while keeping readable text.
     * 
     * Usage: {{ content | stripMarkdown }}
     */
    eleventyConfig.addFilter("stripMarkdown", filterStripMarkdown);

    /*
     * 🔢 Limit Filter
     * Returns a limited number of items from the beginning of an array
     * Usage: {{ collection | limit(5) }}
     * Useful for truncating lists, e.g. showing only the latest N items
     */
    eleventyConfig.addFilter("limit", function (array, limit) {
        return array.slice(0, limit);
    });

    // Takes a number and rounds it down to the nearest whole number.
    // e.g., 5.7 becomes 5
    eleventyConfig.addFilter("floor", (number) => {
        return Math.floor(number);
    });

    /*
     * 🏷️ Page Language Filter
     * Filters collections by the current page language for i18n compatibility
     * Usage: {{ collections.all | pageLang | eleventyNavigation }}
     */
    eleventyConfig.addFilter("pageLang", function (value) {
        return value.filter(item => item.page.lang === this.page.lang)
    });

    /**
     * 🔍 Multi-Property Equality Filter
     * Filters a collection based on multiple property-value pairs.
     * Supports nested properties like "eleventyNavigation.parent".
     * Usage:
     *   {{ collections.all | whereAll({ category: "skola", "eleventyNavigation.parent": "Škola" }) }}
     */
    eleventyConfig.addFilter("whereAll", function (collection, conditions = {}) {
        if (!Array.isArray(collection)) return [];

        // Helper for nested props like "eleventyNavigation.parent"
        function getDeep(obj, path) {
            return path.split(".").reduce((acc, key) => acc && acc[key], obj);
        }

        return collection.filter((item) => {
            return Object.entries(conditions).every(([prop, expected]) => {
                const actual = getDeep(item.data, prop);
                return actual === expected;
            });
        });
    });

    /**
     * 🎯 Find a Single Item in a Collection
     * Finds the first item in a collection that matches multiple property-value pairs.
     * Supports nested properties like "eleventyNavigation.key".
     * Returns the first matching item object, or undefined if no match is found.
     *
     * Usage:
     *   {% set pageNav = collections.all | findWhere({ "eleventyNavigation.key": page.fileSlug }) %}
     *   {% if pageNav %}
     *     <h2>{{ pageNav.data.title }}</h2>
     *   {% endif %}
     */
    eleventyConfig.addFilter("findWhere", function (collection, conditions = {}) {
        if (!Array.isArray(collection)) return undefined;

        function getDeep(obj, path) {
            if (!obj) return undefined;
            return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
        }

        function normalize(v) {
            if (v === undefined || v === null) return v;
            if (typeof v === "string") return v.trim().toLowerCase();
            return v;
        }

        return collection.find((item) => {
            return Object.entries(conditions).every(([prop, expectedValue]) => {
                // Try several places where Eleventy might store the value
                const tries = [
                    getDeep(item.data, prop),       // e.g. item.data.fileSlug
                    getDeep(item, prop),            // e.g. item.fileSlug
                    getDeep(item.data && item.data.page, prop), // e.g. item.data.page.fileSlug
                ];

                // first non-undefined
                const actualRaw = tries.find(x => x !== undefined);

                // Normalize for lenient comparison
                const actual = normalize(actualRaw);
                const expected = normalize(expectedValue);

                // Strictly compare normalized values (works for strings and most primitives)
                return actual === expected;
            });
        });
    });

    /**
     * Sorting Filter
     * Sorts an array of objects by a specified key.
     *
     * - Supports nested properties using dot notation (e.g., "data.order").
     * - Handles numbers, strings, and dates (as strings).
     * - Allows ascending ('asc') or descending ('desc') order.
     * - Pushes items with missing/null keys to the end of the array.
     *
     * Usage:
     *   {# Sort by title, ascending (default) #}
     *   {% set sortedPosts = collections.posts | sortBy("data.title") %}
     *
     *   {# Sort by a custom order field, descending #}
     *   {% set sortedProjects = collections.projects | sortBy("data.order", "desc") %}
     */
    eleventyConfig.addFilter("sortBy", function (array, key, order = 'asc') {
        // Return the array as-is if it's not a valid array
        if (!Array.isArray(array)) {
            return array;
        }

        // Helper to safely access nested properties
        function getDeep(obj, path) {
            return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
        }

        // Create a mutable copy to avoid side effects
        const sortedArray = [...array];

        // Determine the sort direction multiplier
        const direction = order.toLowerCase() === 'desc' ? -1 : 1;

        sortedArray.sort((a, b) => {
            const valA = getDeep(a, key);
            const valB = getDeep(b, key);

            // --- Comparison Logic ---

            // Push items with null or undefined values to the end
            if (valA == null) return 1;
            if (valB == null) return -1;

            // A. Numeric sort (if both values are numbers)
            if (typeof valA === 'number' && typeof valB === 'number') {
                return (valA - valB) * direction;
            }

            // B. Default to locale-aware string sort for everything else
            const stringA = String(valA);
            const stringB = String(valB);

            return stringA.localeCompare(stringB) * direction;
        });

        return sortedArray;
    });

    /**
     * 🏢 Sorts a collection by a predefined 'section' order (with Array Support).
     *
     * - If an item's `section` property is an ARRAY, its sort order is determined
     *   by the section that appears earliest in the custom order list.
     * - Items with a section not in the custom order will be placed at the end,
     *   sorted alphabetically by title among themselves.
     *
     * Usage:
     *   {% set sortedZamestnanci = collections.zamestnanci | sortBySection %}
     */
    eleventyConfig.addFilter("sortBySection", function (collection) {
        // Return an empty array if the input is not a valid array
        if (!Array.isArray(collection)) {
            return [];
        }

        // Define the exact order you want for the sections.
        const customOrder = [
            'Škola',
            'MŠ Korálek',
            'MŠ Kamarád',
            'Družina',
            'Jídelna'
        ];

        /**
         * Helper function to determine the best sort index for an item.
         * @param {string|string[]} sectionValue - The item's section property.
         * @returns {number} The index from customOrder, or -1 if not found.
         */
        function getBestSortIndex(sectionValue) {
            // If the section is a simple string, find its index directly.
            if (typeof sectionValue === 'string') {
                return customOrder.indexOf(sectionValue);
            }

            // If the section is an array, find the highest-priority index.
            if (Array.isArray(sectionValue)) {
                const indices = sectionValue
                    // Map each section string to its index in the customOrder array.
                    .map(s => customOrder.indexOf(s))
                    // Filter out any sections that weren't found (index is -1).
                    .filter(i => i !== -1);

                // If we have at least one valid index, return the smallest one (highest priority).
                if (indices.length > 0) {
                    return Math.min(...indices);
                }
            }

            // If no matching section was found, return -1.
            return -1;
        }

        // Create a mutable copy of the collection to avoid modifying the original.
        const sortedCollection = [...collection];

        // Sort the copy with a custom comparison function.
        sortedCollection.sort((a, b) => {
            // Use our helper function to get the sort index for both items.
            const indexA = getBestSortIndex(a.data.section);
            const indexB = getBestSortIndex(b.data.section);

            // Assign a very high index (Infinity) to any item not found in our custom list.
            // This ensures they are always pushed to the end of the sorted array.
            const effectiveIndexA = indexA === -1 ? Infinity : indexA;
            const effectiveIndexB = indexB === -1 ? Infinity : indexB;

            // If the effective indexes are different, we can sort based on them.
            if (effectiveIndexA !== effectiveIndexB) {
                return effectiveIndexA - effectiveIndexB;
            }

            // If the indexes are the same (e.g., both items' best section is 'Škola'),
            // add a secondary, alphabetical sort by title as a fallback for stable sorting.
            const titleA = a.data.title || '';
            const titleB = b.data.title || '';
            return titleA.localeCompare(titleB);
        });

        return sortedCollection;
    });

    /**
     * 🗂️ Group by Property Filter (with Array Support)
     * Groups an array of objects based on a specified key.
     *
     * - Supports nested properties using dot notation (e.g., "data.section").
     * - If the key's value is an ARRAY, the item will be added to a group for EACH value in the array.
     * - Items where the key is not set, is undefined, or is an empty array
     *   will be placed in a special group with the key "_ungrouped".
     *
     * Returns an array of objects, each containing a 'key' (the group name)
     * and 'items' (an array of the grouped items), making it easy to loop through.
     *
     * Usage for single property:
     *   {% set employeesBySection = collections.zamestnanci | groupBy("data.section") %}
     *
     * Usage for array property (e.g., tags):
     *   {% set postsByTag = collections.posts | groupBy("data.tags") %}
     */
    eleventyConfig.addFilter("groupBy", (array, key) => {
        // Return an empty array if the input isn't a valid array
        if (!Array.isArray(array)) {
            return [];
        }

        const ungroupedKey = "_ungrouped";
        const grouped = {};

        array.forEach(item => {
            // Resolve the value of the key, which could be a string, an array, or undefined.
            const groupValue = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, item);

            // ================================================================= //
            // ⭐ NEW LOGIC TO HANDLE ARRAYS ⭐
            // ================================================================= //
            if (Array.isArray(groupValue)) {
                // If the array is empty, treat the item as ungrouped.
                if (groupValue.length === 0) {
                    if (!grouped[ungroupedKey]) {
                        grouped[ungroupedKey] = [];
                    }
                    grouped[ungroupedKey].push(item);
                } else {
                    // If the array has values, add the item to a group for EACH value.
                    groupValue.forEach(keyInArray => {
                        if (!grouped[keyInArray]) {
                            grouped[keyInArray] = [];
                        }
                        grouped[keyInArray].push(item);
                    });
                }
            }
            // ================================================================= //
            // ⭐ FALLBACK TO ORIGINAL LOGIC FOR SINGLE VALUES ⭐
            // ================================================================= //
            else {
                let groupKey = groupValue;

                if (groupKey === undefined) {
                    groupKey = ungroupedKey;
                }

                if (!grouped[groupKey]) {
                    grouped[groupKey] = [];
                }
                grouped[groupKey].push(item);
            }
        });

        // The final transformation step remains the same.
        return Object.keys(grouped).map(groupKey => ({
            key: groupKey,
            items: grouped[groupKey]
        }));
    });

    // ═════════════════════════════════════════════════════════════════════════
    // SHORTCODES
    // Generate dynamic content with JavaScript
    // Learn more: https://www.11ty.dev/docs/shortcodes/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📆 Current Year Shortcode
     * Outputs the current year (useful for copyright notices)
     * Usage: {% year %}
     * Updates automatically with each build
     */
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // ═════════════════════════════════════════════════════════════════════════
    // BUILD CONFIGURATION
    // Define input/output directories and template engine
    // ═════════════════════════════════════════════════════════════════════════

    return {
        dir: {
            input: "src", // Source files directory
            output: "public", // Build output directory
            includes: "_includes", // Partial templates directory
            data: "_data", // Global data files directory
        },
        htmlTemplateEngine: "njk", // Nunjucks for HTML templates
    };
};
