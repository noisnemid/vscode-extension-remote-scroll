import * as net from 'net';
import * as vscode from 'vscode';


export class RemoteScrollServer
{
    server: net.Server;
    enabled: boolean;
    openedDocs: Array<vscode.TextDocument | any>;
    informFilenameEnabled: boolean;
    // pEditors: any; // picked editors stored

    constructor()
    {
        this.openedDocs = [];
        this.informFilenameEnabled = true;
        vscode.workspace.onDidOpenTextDocument(e =>
        {
            this.openedDocs.push(e);
        });

        
        this.enabled = true;
        this.server = net.createServer({ allowHalfOpen: true }, (socket: net.Socket) =>
        {
            socket.setEncoding('utf8');  //mind the encoding description is 'utf8' not 'utf-8', neither ascii to avoid CJK err.
            socket.write('RS-WELCOME\n');

            let remoteAddress: string | undefined = socket.remoteAddress + ':' + socket.remotePort?.toString();
            vscode.window.showInformationMessage('👯‍♀️ Client Connected:' + remoteAddress);

            let msg: string = "";
            socket.on('data', (data: Buffer) =>
            {
                if (this.enabled)
                {
                    msg += data.toString();
                    let chk: number = data.toString().charCodeAt(data.length - 1)
                    if (msg.length >= 4096 || chk === 13 || chk === 10)
                    {
                        let info: any = {};
                        try
                        {
                            info = JSON.parse(msg);
                            if (info['authCode'] === vscode.workspace.getConfiguration('RemoteScroll').get('authCode'))
                            {
                                let p: vscode.Position = new vscode.Position(info['lineNumber'], 1);
                                let r: vscode.Range = new vscode.Range(p, p);
                                this.pickEditor(info['filename'])?.revealRange(r, vscode.TextEditorRevealType.InCenter);
                                if (this.informFilenameEnabled)
                                {
                                    vscode.window.showInformationMessage('REQUESTED FILENAME', info['filename']);
                                    this.informFilenameEnabled = false;
                                }
                            }
                            else socket.write('ERROR:AUTH-FAILED\n')
                        } catch (error)
                        {
                            console.error(error);
                        }

                        msg = ""
                    }
                } else socket.write('INFO:SERVER-PAUSED\n');
            });

            socket.on('close', err =>
            {
                if (err) vscode.window.showInformationMessage('🔌 Client Disconnected:' + remoteAddress)
            });
        })
    }

    // Mark the editor to scroll.
    private pickEditor(filename: string): vscode.TextEditor|undefined
    {
        let found: boolean = false;
        
        if (vscode.workspace.getConfiguration('RemoteScroll').get('checkFilename'))
        {
            
            let f0: vscode.Uri = vscode.Uri.file(filename);
            
            for (let editor of vscode.window.visibleTextEditors)
            {
                let f1: vscode.Uri = vscode.Uri.file(editor.document.fileName);
                if (f0.fsPath === f1.fsPath)
                {
                    found = true;
                    return editor;
                }
                else found = false;
            }

            if(!found)
            {
                if (vscode.workspace.getConfiguration('RemoteScroll').get('autoForceOpen'))
                {
                    vscode.window.showTextDocument(f0,
                        {
                            preserveFocus: true,
                            viewColumn: vscode.ViewColumn.Active,
                            preview:false
                        }).then(
                            edt =>  edt
                        );
                    
                } else
                {
                    return undefined;
                }
            }
        } else
        {
            return vscode.window.activeTextEditor;
        }
        return undefined;
    }

    public start()
    {
        this.enabled = true;
        this.informFilenameEnabled = true;

        this.server.listen(vscode.workspace.getConfiguration('RemoteScroll').get('port'), vscode.workspace.getConfiguration('RemoteScroll').get('host'), () =>
        {
            vscode.window.showInformationMessage('📶 Server Started:' + JSON.stringify(this.server.address()));
        })
    }

    public stop()
    {
        this.enabled = false;
        this.server.close();
        vscode.window.showInformationMessage('⏹ Server Stopped.');
    }

    public toggle()
    {
        this.enabled = !this.enabled;
        this.informFilenameEnabled = true;
        vscode.window.showInformationMessage(this.enabled ? '▶ Continues...' : '⏸ PAUSED!');
        console.dir(this.openedDocs);
        
    }

}
