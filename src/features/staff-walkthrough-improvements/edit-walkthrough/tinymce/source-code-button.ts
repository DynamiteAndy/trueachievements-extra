import { waitForElement } from '@ta-x-utilities';

const createScript = (id: string, innerHtml: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = id;
  script.innerHTML = innerHtml;

  return script;
};

const buildSourceCodeCommandScript = (): HTMLScriptElement => {
  const id = 'ta-x-staff-walkthrough-improvements-add-code-editor-command';
  const script = `tinymce.PluginManager.add("code", function(e) {
        function o() {
            var o = tinymce.editors.txtWalkthrough.windowManager.open({
                title: "Source code",
                body: {
                    type: "textbox",
                    name: "code",
                    multiline: true,
                    minWidth: tinymce.editors.txtWalkthrough.getParam("code_dialog_width", 600),
                    minHeight: tinymce.editors.txtWalkthrough.getParam("code_dialog_height", Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
                    spellcheck: false,
                    style: "direction: ltr; text-align: left"
                },
                onSubmit: function(o) {
                    tinymce.editors.txtWalkthrough.focus(),
                    tinymce.editors.txtWalkthrough.undoManager.transact(function() {
                        tinymce.editors.txtWalkthrough.setContent(o.data.code)
                    }),
                    tinymce.editors.txtWalkthrough.selection.setCursorLocation(),
                    tinymce.editors.txtWalkthrough.nodeChanged()
                }
            });
            o.find("#code").value(tinymce.editors.txtWalkthrough.getContent({
                source_view: true
            }))
        }
        tinymce.editors.txtWalkthrough.addCommand("mceCodeEditor", o)
    })();`;

  return createScript(id, script);
};

const buildShowSourceCodeButtonScript = (): HTMLScriptElement => {
  const id = 'ta-x-staff-walkthrough-improvements-show-code-editor';
  const script = `document.querySelector(".js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code").addEventListener("click", function(e) {
        tinymce.activeEditor.execCommand("mceCodeEditor");
    });`;

  return createScript(id, script);
};

export const addSourceCodeButton = async (): Promise<void> => {
  const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;

  iframe.addEventListener('load', async () => {
    const sourceCodeCommand = buildSourceCodeCommandScript();
    const sourceCodeButton = buildShowSourceCodeButtonScript();

    document.body.appendChild(sourceCodeCommand);
    document.body.appendChild(sourceCodeButton);

    iframe.removeEventListener('load', this);
  });
};

export default { addSourceCodeButton };
