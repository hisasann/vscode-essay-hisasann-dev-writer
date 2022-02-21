// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-essay-hisasann-dev-writer" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'vscode-essay-hisasann-dev-writer.helloWorld',
    async () => {
      if (!vscode.workspace || !vscode.workspace.workspaceFolders) {
        return vscode.window.showErrorMessage(
          'Please open a project folder first',
        );
      }

      // ファイル名を入力するテキストボックスを表示する
      var ibo = <vscode.InputBoxOptions>{
        prompt: 'essay file name',
        placeHolder: 'xxxx-xxxx-xxxx',
      };
      const fileName = await vscode.window.showInputBox(ibo);
      console.log('fineName:', fileName);

      const workspacePath = vscode.workspace.workspaceFolders[0].uri
        .toString()
        .split(':')[1];
      console.log('workspacePath:', workspacePath);

      const basePosition = 2;
      const title = 'essay';
      const articlesPath = path.join(workspacePath, 'articles');
      const filePath = path.join(workspacePath, 'essay', `${fileName}.md`);

      if (fs.existsSync(filePath)) {
        return;
      }

      const content = `# ${title}\n\n`;
      fs.mkdir(articlesPath, { recursive: true }, (mkdirError) => {
        if (mkdirError) {
          vscode.window.showErrorMessage(`Failed to create ${articlesPath}`);
          return;
        }

        fs.writeFile(filePath, content, (error) => {
          if (error) {
            vscode.window.showErrorMessage(`Failed to create ${filePath}`);
            return;
          }
          vscode.window.showInformationMessage(`Created ${filePath}`);

          const vscodeUri = vscode.Uri.file(filePath);
          vscode.workspace
            .openTextDocument(vscodeUri)
            .then((vscodeTextDocument) => {
              vscode.window
                .showTextDocument(vscodeTextDocument)
                .then((editor) => {
                  const position1 = new vscode.Position(0, basePosition);
                  const position2 = new vscode.Position(
                    0,
                    basePosition + title.length,
                  );
                  editor.selections = [
                    new vscode.Selection(position1, position2),
                  ];
                });
            });
        });
      });
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
