import * as vscode from 'vscode';

import getResource from './getResource';

export function activate(context: vscode.ExtensionContext) {
    console.log('AWESOMENESS 111111!!!!');
    // Register a hover provider
    const disposable = vscode.languages.registerHoverProvider('*', {
        async provideHover(document, position) {
            console.log('AWESOMENESS 222222!!!!');

            const range = document.getWordRangeAtPosition(
                position,
                /((http|https):\/\/[^\s"'`)]+)/,
            );
            if (range) {
                const link = document.getText(range);
                const linkData = await getResource(link);
                console.log('linkData :::', linkData);
                if (!linkData) return null;

                let markdownString: vscode.MarkdownString | undefined;
                if (linkData.type === 'image') {
                    markdownString = new vscode.MarkdownString(
                        `<img alt="${link}" src="${linkData.data}" height="300" />`,
                    );
                    markdownString.supportHtml = true;
                    // } else if (linkData.type === 'webpage') {
                    // markdownString = new vscode.MarkdownString(`# ${linkData.data.title}`);
                }

                if (!markdownString) return null;
                return new vscode.Hover([markdownString], range);
            }

            return null;
        },
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
