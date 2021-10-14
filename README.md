# Remote Scroll README

Scroll the document via JSON directives through socket connection remotely, the VSCode is a sync-viewport now!

Sometimes you might need a text editor to automatically scrolling the view range synchronically with some corresponding or relevant external data...

## Usage

Press <CTRL+F12> to start a server, and connect to the server via telnet or socket programmes, provide a JSON data in the following schema:

```
{
    "authCode":"",
    "filename":"d:\\docs\\someText中文文件名示例.txt",
    "lineNumber":100
}


// feel free to provide "filename" value in your favorite format, such as:

"/home/user/username/documents/someText.txt"

// or

"d:\\AbC\\dEf/Ghi.txt"

```

A DEMO WITH PYTHON:

```
# REMOTE SCROLL PYTHON CLIENT DEMO
import socket
from  json import dumps
from time import sleep

HOST, PORT = 'localhost', 9527
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    for i in range(1, 10000):
        msg = {
            'filename':'sometext.txt',
            'lineNumber':i,
            'authCode':'123'
        }
        buf = (dumps(msg,ensure_ascii=False,indent=0)).encode('utf-8')+b'\n'
        s.sendall(buf)
        # data = s.recv(1024).decode('utf-8')
        # print('Received', data)
        sleep(1)
```


## Features

1. Scroll an editor with a given filename to a specific line-number via net control;
2. This control mode turns Visual Studio Code a special viewport in some special scenarios;
3. [CTRL+F12] to start a server;
3. [F12] to toggle server pause/resume;

<!-- ## Requirements

... -->

## Extension Settings

This extension contributes the following settings:

* `RemoteScroll.host`: The host address of the remote control server, default = 'localhost'.
* `RemoteScroll.port`: The tcp/ip port the remote control server listens to, default = 9527.
* `RemoteScroll.checkFilename`: Whether to check active document file name before scrolling. if no, scroll the current active one.
* `RemoteScroll.authCode`: A string to identify or authorize connection.
* `RemoteScroll.autoForceOpen`: If file is not already opened in an editor when the server listens, automatically try to open the file that the client-side requests. Notice this config only effects while "checkFilename" enabled.

<!-- ## Known Issues

... -->

## Release Notes


### 1.0.5, 1.0.6, 1.0.7

Upgrade package dependencies following the security report of the development robot of vscode.

### 1.0.4

Upgrade package-lock.json following the security report of the development robot of vscode.


### 1.0.0

Basically done.

<!-- Fixed issue #. -->

<!-- ### 1.1.0

Added features X, Y, and Z. -->

-----------------------------------------------------------------------------------------------------------

<!-- ### CONTRIBUTORS

... -->

**Enjoy!**
