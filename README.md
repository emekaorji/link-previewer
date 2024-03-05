# Link Previewer VSCode Extension

<div style="border-radius: 1em; overflow: hidden;"><img alt="Link Previewer Logo" src="" /></div>

This VSCode extension allow you to preview a webpage metadata (title, description and image) when a valid URL is hovered in an editor view. This way, you don't always have to open a URL in the browser to see what it contains.

### Features 📙

- Preview the title and description of a web page
- Preview the Largest Contentful Paint image
- Prioritize Open Graph metadata

<div style="border-radius: 1em; overflow: hidden;"><img alt="Link Previewer Demo" src="" /></div>

### Installation 📝

#### Via in-app extension view

1. Launch Visual Studio Code.
1. Go to the Extensions view by clicking on the square icon on the left sidebar or by using the shortcut `Cmd+Shift+X` or `Ctrl+Shift+X` on windows.
1. Search for "Link Previewer" in the Extensions marketplace.
1. Click the "Install" button next to the "Link Previewer" extension.
1. Once installed, you can find the extension in the command palette.

#### Via online VSCode marketplace

1. Head over to https://marketplace.visualstudio.com/items?itemName=coderabbi.link-previewer and click the "Install" button.
1. Follow step 4 and 5 above

### Usage 🛠️

1. Open a text editor.
1. Hover a valid URL, you should see a popover containing the metadata of the webpage, including a cover image.
1. For image URLs, you should see only the image and nothing else.
   <div style="border-radius: 1em; overflow: hidden;"><img alt="Image URL Demo" src="" /></div>

### Configuration

This extension contributes the following configuration:

- `linkpreview.maxHeight`

```json
{
  "linkpreview.maxHeight": 500
}
```

### Extension Deactivation 😔

The extension is deactivated automatically when you close Visual Studio Code or manually disable the extension in the Extensions view.

### Troubleshooting 🐛

- If there is no cover image, the webpage most likely does not have one.
- If there is no preview data at all, there was an error in fetching that data. Hover again to fetch the metadata again.

### Feedback and Contributions 👂

In case of any errors or issues, refer to the [Troubleshooting](#Troubleshooting) section of this docs. If the error persists, please create an issue [here](https://github.com/emekaorji/link-previewer/issues/new?title=).

Below is a list of possible feature requests

- cache metadata for unchanged URLs
- support for local/relative image file paths

Feel free to also create a PR if you are willing to address an issue or add a new feature and I'll take a look as soon as possible.

For any other feedback, please reach out to me on Twitter (@code_rabbi).

Enjoy! 💙
