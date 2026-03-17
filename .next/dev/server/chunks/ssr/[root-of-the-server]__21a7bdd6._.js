module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/design-system/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/design-system/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/tokens/colors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "colors",
    ()=>colors
]);
const colors = {
    planton: {
        forest: '#145559',
        dark: '#0A2D30',
        accent: '#ADCF78',
        cream: '#F7F3DB',
        ink: '#191919',
        muted: '#6B7280',
        white: '#FFFFFF'
    },
    surface: {
        default: '#FFFFFF',
        card: '#F0F4F0',
        dark: '#0A2D30',
        forest: '#145559'
    },
    border: {
        light: 'rgba(0, 0, 0, 0.2)',
        dark: 'rgba(255, 255, 255, 0.1)'
    }
};
}),
"[project]/src/app/design-system/colors/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ColorsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/tokens/colors.ts [app-rsc] (ecmascript)");
;
;
const swatches = [
    {
        name: 'forest',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.forest,
        usage: 'Primary text, headings, borders on light',
        dark: true
    },
    {
        name: 'dark',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.dark,
        usage: 'Deep contrast band backgrounds',
        dark: true
    },
    {
        name: 'accent',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.accent,
        usage: 'Signal only — borders, labels, CTA',
        dark: false
    },
    {
        name: 'cream',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.cream,
        usage: 'On-dark text and backgrounds',
        dark: false
    },
    {
        name: 'ink',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.ink,
        usage: 'Near-black body text',
        dark: true
    },
    {
        name: 'muted',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.muted,
        usage: 'Captions, secondary text',
        dark: false
    },
    {
        name: 'white',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].planton.white,
        usage: 'Content surfaces',
        dark: false
    },
    {
        name: 'surface-card',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].surface.card,
        usage: 'Slightly elevated surfaces',
        dark: false
    },
    {
        name: 'surface-dark',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].surface.dark,
        usage: 'Dark band surfaces',
        dark: true
    },
    {
        name: 'surface-forest',
        value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$tokens$2f$colors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["colors"].surface.forest,
        usage: 'Brand marketing blocks',
        dark: true
    }
];
function ColorsPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-xs uppercase tracking-[0.12em] text-planton-accent",
                        children: "Foundations"
                    }, void 0, false, {
                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.1] tracking-[-0.04em] text-planton-forest",
                        children: "Cores"
                    }, void 0, false, {
                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/design-system/colors/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                children: swatches.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-r border-[rgba(0,0,0,0.2)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-24 w-full",
                                style: {
                                    background: s.value
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/design-system/colors/page.tsx",
                                lineNumber: 31,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-xs uppercase tracking-[0.05em] text-planton-accent",
                                        children: s.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-sm text-planton-forest",
                                        children: s.value
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-sans text-xs text-planton-muted leading-[1.65]",
                                        children: s.usage
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/design-system/colors/page.tsx",
                                lineNumber: 35,
                                columnNumber: 13
                            }, this)
                        ]
                    }, s.name, true, {
                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/design-system/colors/page.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-16 flex flex-col gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-heading text-xl text-planton-forest tracking-[-0.02em]",
                        children: "Bordas"
                    }, void 0, false, {
                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border border-[rgba(0,0,0,0.2)] flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-xs text-planton-accent uppercase tracking-[0.05em]",
                                        children: "border-light"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-sans text-sm text-planton-muted",
                                        children: "rgba(0, 0, 0, 0.2) — superfícies claras"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/design-system/colors/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 bg-planton-dark border border-[rgba(255,255,255,0.1)] flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-xs text-planton-accent uppercase tracking-[0.05em]",
                                        children: "border-dark"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-sans text-sm text-planton-cream/80",
                                        children: "rgba(255, 255, 255, 0.1) — superfícies escuras"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/design-system/colors/page.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/design-system/colors/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/design-system/colors/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/design-system/colors/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/design-system/colors/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/design-system/colors/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__21a7bdd6._.js.map