# BingExtender

## Overview
BingExtender is an Edge extension developed to enhance your BingAI experience by:

- Increasing the character limit to 50,000 characters per prompt
- Line breaks in long messages
- Prompt templates

## Installation
### Developer Mode
To use BingExtender, you will need to enable Developer Mode in Edge. Here's how:

1. Open Edge and navigate to `edge://extensions/`.
2. Toggle on the **Developer mode** switch in the top right corner.
3. Click the **Load unpacked** button and select the `bing-extender` directory.
4. The extension will be installed, and you can find it in the Edge toolbar.

### Adding and Customizing Prompts
BingExtender comes with pre-configured prompts, but you can add or modify them in the `prompts.json` file:

1. Open the `prompts.json` file in a text editor.
2. Add or modify the prompts using the existing JSON format.
3. Save the file.
4. Reboot the extension to see the new prompts in action.

Here's an example of the JSON format, including two additional prompts:

```json
[
    {
        "title": "Mathematics Copilot",
        "description": "Used for assisting with mathematical problems.",
        "prompt": "I have this mathematical problem:\n\n%% PASTE YOUR PROBLEM HERE %%\n\nCan you help me solve it?"
    },
    {
        "title": "Healthcare Copilot",
        "description": "Used for better understanding healthcare topics.",
        "prompt": "I read this medical term:\n\n%% PASTE THE TERM HERE %%\n\nCan you explain what it means?"
    }
]
```

**Note:** After modifying the `prompts.json` file, you'll need to reload the extension for the changes to take effect.

## Contributing
Feel free to open issues for any bugs, enhancements, or questions. Your contributions are welcome, and your feedback helps improve BingExtender.

## Changelog
08/09/2023: Initial release (v1.1)
