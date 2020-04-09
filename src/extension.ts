import * as vscode from 'vscode';
import { RemoteScrollServer } from './remotes_scroll';

export function activate(context: vscode.ExtensionContext)
{
    console.log('Hurrah! Remote Scroll Ready!');

    let RS = new RemoteScrollServer();

    context.subscriptions.push(vscode.commands.registerCommand('extension.start_rs', () =>
    {
        RS.start();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.stop_rs', () =>
    {
        RS.stop();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.toggle_rs', () =>
    {
        RS.toggle();
    }));
}

export function deactivate() { }
