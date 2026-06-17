import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const channel = vscode.window.createOutputChannel('Local Ollama Helper');
  channel.appendLine('Local Ollama Helper activated');

  const disposable = vscode.commands.registerCommand('localOllamaHelper.askOllama', async () => {
    try {
      const config = vscode.workspace.getConfiguration('localOllamaHelper');
      const apiUrl = (config.get<string>('apiUrl') || 'http://localhost:11434/api/chat').trim();
      const model = (config.get<string>('model') || 'llama3.2:1b').trim();

      const prompt = await vscode.window.showInputBox({
        prompt: 'Enter a prompt to send to Ollama',
        placeHolder: 'e.g. Explain the Observer pattern in simple terms',
      });

      if (prompt === undefined) {
        // User cancelled the input
        return;
      }

      channel.appendLine(`Sending prompt to ${apiUrl} (model: ${model})`);
      channel.appendLine('--- Prompt ---');
      channel.appendLine(prompt);
      channel.appendLine('--------------');

      const fetchFn = (globalThis as any).fetch;
      if (typeof fetchFn !== 'function') {
        const msg = 'Fetch API is not available in this environment. The extension requires Node 18+ or an environment with global fetch.';
        vscode.window.showErrorMessage(msg);
        channel.appendLine(msg);
        return;
      }

      const payload = {
        model,
        messages: [{ role: 'user', content: prompt }],
      } as any;

      const resp = await fetchFn(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();

      if (!resp.ok) {
        const errMsg = `Ollama API returned ${resp.status} ${resp.statusText}: ${text}`;
        vscode.window.showErrorMessage('Failed to get response from Ollama — see Output for details');
        channel.appendLine(errMsg);
        return;
      }

      // Try to parse JSON if possible, otherwise show raw text
      let display = text;
      try {
        const json = JSON.parse(text);
        // Attempt to extract a sensible response from common shapes
        if (json.response) {
          display = typeof json.response === 'string' ? json.response : JSON.stringify(json.response, null, 2);
        } else if (json.choices && Array.isArray(json.choices) && json.choices[0]) {
          display = json.choices.map((c: any) => c.text || c.message || c).join('\n---\n');
        } else if (json.output) {
          display = typeof json.output === 'string' ? json.output : JSON.stringify(json.output, null, 2);
        } else {
          display = JSON.stringify(json, null, 2);
        }
      } catch (e) {
        // not JSON, keep text
      }

      channel.appendLine('--- Ollama response ---');
      channel.appendLine(display);
      channel.appendLine('------------------------');
      channel.show(true);

    } catch (err: any) {
      const msg = err && err.message ? err.message : String(err);
      vscode.window.showErrorMessage('An error occurred while asking Ollama: ' + msg);
      const channel = vscode.window.createOutputChannel('Local Ollama Helper');
      channel.appendLine('Error: ' + msg);
      channel.show(true);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // no-op
}
