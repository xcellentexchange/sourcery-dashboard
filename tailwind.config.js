import formsPlugin from "@tailwindcss/forms";
import typographyPlugin from "@tailwindcss/typography";

export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				progress: {
					"0%": { width: "0%" },
					"80%": { opacity: 1 },
					"100%": { opacity: 0.5, width: "100%" },
				},
			},
			animation: {
				progress: "progress 1 forwards linear",
			},
			transitionProperty: {
				width: "width",
				spacing: "margin, padding",
			},
		},
	},
	plugins: [formsPlugin, typographyPlugin],
};
