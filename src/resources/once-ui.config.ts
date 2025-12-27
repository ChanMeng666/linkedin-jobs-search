// Once UI Configuration for LinkedIn Jobs Search
// LinkedIn Brand Color: #0A66C2

const baseURL = "https://linkedin-jobs-search.vercel.app";

const routes = {
  "/": true,
  "/search": true,
  "/dashboard": true,
  "/login": true,
  "/analytics": true,
};

const display = {
  location: false,
  time: false,
  themeSwitcher: true,
};

// Style Configuration - LinkedIn Brand Color #0A66C2
const style = {
  theme: "system" as const,           // dark | light | system
  neutral: "gray" as const,           // sand | gray | slate
  brand: "custom" as const,           // Using custom LinkedIn blue #0A66C2
  accent: "cyan" as const,            // Secondary accent
  solid: "contrast" as const,         // color | contrast
  solidStyle: "flat" as const,        // flat | plastic
  border: "playful" as const,         // rounded | playful | conservative
  surface: "translucent" as const,    // filled | translucent (enables glassmorphism)
  transition: "all" as const,         // all | micro | macro
  scaling: "100" as const,            // 90 | 95 | 100 | 105 | 110
};

// Data visualization style
const dataStyle = {
  variant: "gradient" as const,
  mode: "categorical" as const,
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false
  },
};

// Background Effects Configuration
const effects = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: true,
    opacity: 60,
    x: 50,
    y: 0,
    width: 100,
    height: 60,
    tilt: 0,
    colorStart: "brand-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,            // Enable dot pattern background
    opacity: 30,
    size: "2",
    color: "brand-on-background-weak",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

// Site content configuration
const home = {
  title: "LinkedIn Jobs Search - Smart Job Search Platform",
  description: "Search LinkedIn jobs across multiple countries, save favorites, track applications, and analyze market trends.",
  path: "/",
  image: "/assets/images/og-image.png",
};

export { display, routes, baseURL, style, dataStyle, effects, home };
