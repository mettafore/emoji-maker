# Project Overview

Use this guide to build a web app where user can input text description to generate emoji using replicate model.

# Feature Requirements

 - Use Next.js, Supabase, shadcn/ui, Clerk, and Lucide React
 - Create a form where users can input text descriptions to generate emojis
 - Implement a nice UI and animation when generating emojis
 - Display all images ever generated for a user
 - When hovering on an image, provide options to download it and an icon for liking

# Relavant Docs

## How to use replicate generate emoji model

Set the REPLICATE_API_TOKEN environment variable

export REPLICATE_API_TOKEN=<paste-your-token-here>

Visibility

Copy
Learn more about authentication

Install Replicate’s Node.js client library

npm install replicate

Copy
Learn more about setup
Run fofr/sdxl-emoji using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "A TOK emoji of a man",
    apply_watermark: false
};

const output = await replicate.run("fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e", { input });
console.log(output)
//=> ["https://replicate.delivery/pbxt/a3z81v5vwlKfLq1H5uBqpVm...

# Current File Structure

EMOJI-MAKER
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib
│   └── utils.ts
├── node_modules
├── requirements
│   └── frontend_instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
 - All new components should be in the components folder. They should be named like example-component.tsx.
 - All new pages should be in the app folder. 
