import * as vscode from 'vscode';

import getResource from './getResource';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerHoverProvider('*', {
        async provideHover(document, position) {
            const range = document.getWordRangeAtPosition(
                position,
                /((http|https):\/\/[^\s"'`).]+(?:\.[^\s"'`).]+)*)/,
            );
            if (range) {
                const link = document.getText(range);

                const linkData = await getResource(link);
                if (!linkData) {
                    const isBrokenLink = new vscode.MarkdownString(
                        `This URL is broken, or the link is not a valid image or webpage.`,
                        true,
                    );
                    isBrokenLink.supportHtml = true;
                    return new vscode.Hover(isBrokenLink, range);
                }

                const maxHeight = vscode.workspace
                    .getConfiguration('linkpreview')
                    .get('maxHeight', 300);

                let markdownString: vscode.MarkdownString | undefined;
                if (linkData.type === 'image') {
                    markdownString = new vscode.MarkdownString(
                        `<img alt="${link}" src="${linkData.data}" height="${maxHeight}" />`,
                    );
                } else if (linkData.type === 'webpage' && linkData.data.title) {
                    markdownString = new vscode.MarkdownString(
                        `### ${linkData.data.title}\n\n${linkData.data.description}\n\n${linkData.data.image ? `<img alt="${linkData.data.domain}" src="${linkData.data.image}" height="${maxHeight}" />` : ''}`,
                    );
                }

                if (!markdownString) return null;
                markdownString.supportHtml = true;
                return new vscode.Hover([markdownString], range);
            }

            return null;
        },
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
