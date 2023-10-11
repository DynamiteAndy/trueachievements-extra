import { TinyMCEScript } from '@ta-x-models';

class TextColorScript extends TinyMCEScript {
  constructor() {
    super('ta-x-staff-walkthrough-improvements-add-text-color-command');
  }

  buildScript = (): HTMLScriptElement => {
    const script = `
    ((editor) => {
      console.debug('Adding Text Color Button');

      var applyColor = function(editor, type, value) {
        editor.undoManager.transact(function() {
          editor.focus();
          editor.formatter.apply(type, { value: value });
          editor.nodeChanged();
        });
      };

      var removeColor = function(editor, type) {
        editor.undoManager.transact(function() {
          editor.focus();
          editor.formatter.remove(type, { value: null }, null, true);
          editor.nodeChanged();
        });
      };

      var createColorButtonClickHandler = function(editor, isForeColor) {
        return function(event) {
          var control = event.control;

          if (control._color) {
            editor.execCommand("mceApplyTextcolor", control.settings.format, control._color);
          } else {
            editor.execCommand("mceRemoveTextcolor", control.settings.format);
          }
        };
      };

      var createColorCellClickHandler = function(editor, isForeColor, rowCount) {
        return function(event) {
          var target = event.target;
          var color = target.getAttribute("data-mce-color");
          var lastId = parent.lastId;

          if (lastId) {
            tinymce.DOM.get(lastId).setAttribute("aria-selected", "false");
          }

          target.setAttribute("aria-selected", true);
          parent.lastId = target.id;

          if (color !== null) {
            if (color === "transparent") {
              editor.execCommand("mceRemoveTextcolor", isForeColor ? "forecolor" : "hilitecolor");
            } else {
              applyColor(editor, isForeColor ? "forecolor" : "hilitecolor", color);
            }
          } else {
            editor.hidePanel();
          }
        };
      };

      var generateColorTable = function(colorList, rows, cols) {
        var cellIndex = 0;
        var ariaId = tinymce.DOM.uniqueId("mcearia");

        var generateColorCell = function(color, text) {
          var isTransparent = color === "transparent";
          return '<td class="mce-grid-cell' + (isTransparent ? " mce-colorbtn-trans" : "") + '"><div id="' + ariaId + "-" + cellIndex++ + '" data-mce-color="' + (color || "") + '" role="option" tabIndex="-1" style="' + (color ? "background-color: " + color : "") + '" title="' + text + '">' + (isTransparent ? "&#215;" : "") + "</div></td>";
        };

        var html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';
        
        colorList.push({
          text: "No color",
          color: "transparent"
        });

        for (var i = 0; i < rows; i++) {
          html += "<tr>";
          
          for (var j = 0; j < cols; j++) {
            html += cellIndex < colorList.length ? generateColorCell(colorList[cellIndex].color, colorList[cellIndex].text) : "<td></td>";
          }
         
          html += "</tr>";
        }

        return html += "</tbody></table>";
      };

      var generateColorGrid = function(editor, isForeColor) {
        var rows = 5;
        var cols = 8;
        var colorList = [
          { text: 'Black', color: '#000000' },
          { text: 'Burnt orange', color: '#993300' },
          { text: 'Dark olive', color: '#333300' },
          { text: 'Dark green', color: '#003300' },
          { text: 'Dark azure', color: '#003366' },
          { text: 'Navy Blue', color: '#000080' },
          { text: 'Indigo', color: '#333399' },
          { text: 'Very dark gray', color: '#333333' },
          { text: 'Maroon', color: '#800000' },
          { text: 'Orange', color: '#FF6600' },
          { text: 'Olive', color: '#808000' },
          { text: 'Green', color: '#008000' },
          { text: 'Teal', color: '#008080' },
          { text: 'Blue', color: '#0000FF' },
          { text: 'Grayish blue', color: '#666699' },
          { text: 'Gray', color: '#808080' },
          { text: 'Red', color: '#FF0000' },
          { text: 'Amber', color: '#FF9900' },
          { text: 'Yellow green', color: '#99CC00' },
          { text: 'Sea green', color: '#339966' },
          { text: 'Turquoise', color: '#33CCCC' },
          { text: 'Royal blue', color: '#3366FF' },
          { text: 'Purple', color: '#800080' },
          { text: 'Medium gray', color: '#999999' },
          { text: 'Magenta', color: '#FF00FF' },
          { text: 'Gold', color: '#FFCC00' },
          { text: 'Yellow', color: '#FFFF00' },
          { text: 'Lime', color: '#00FF00' },
          { text: 'Aqua', color: '#00FFFF' },
          { text: 'Sky blue', color: '#00CCFF' },
          { text: 'Red violet', color: '#993366' },
          { text: 'White', color: '#FFFFFF' },
          { text: 'Pink', color: '#FF99CC' },
          { text: 'Peach', color: '#FFCC99' },
          { text: 'Light yellow', color: '#FFFF99' },
          { text: 'Pale green', color: '#CCFFCC' },
          { text: 'Pale cyan', color: '#CCFFFF' },
          { text: 'Light sky blue', color: '#99CCFF' },
          { text: 'Plum', color: '#CC99FF' }
        ];
          
        return generateColorTable(colorList, rows, cols);
      };

      editor.addCommand("mceApplyTextcolor", function(cmd, value) {
          applyColor(editor, cmd, value);
      });

      editor.addCommand("mceRemoveTextcolor", function(cmd) {
        removeColor(editor, cmd);
      });

      editor.addButton('forecolor', {
        type: "colorbutton",
        tooltip: 'Text color',
        format: 'forecolor',
        panel: {
          role: "application",
          ariaRemember: true,
          html: generateColorGrid(editor, true),
          onclick: createColorCellClickHandler(editor, true, 8)
        },
        onclick: createColorButtonClickHandler(editor, true)
      });

      editor.addButton('backcolor', {
        type: "colorbutton",
        tooltip: 'Background color',
        format: 'hilitecolor',
        panel: {
          role: "application",
          ariaRemember: true,
          html: generateColorGrid(editor, false),
          onclick: createColorCellClickHandler(editor, false, 8)
        },
        onclick: createColorButtonClickHandler(editor, false)
      });

      var forecolorButton = editor.buttons['forecolor'];
      var backcolorButton = editor.buttons['backcolor'];
      var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg.settings.name === 'ta-x-group';
      })[0];

      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.append(forecolorButton);
      taxGroup.append(backcolorButton);

      console.debug('Added Text Color Button');
    })(tinymce.activeEditor);
  `;

    return this.createScript(script);
  };
}

export const addTextColorButtons = new TextColorScript().injectScript;
