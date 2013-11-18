/*
* Copyright (c) 2013 Travis Almand. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global define, brackets, $, action */

define(function (require, exports, module) {
    
    'use strict';

    var AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        FileUtils = brackets.getModule("file/FileUtils"),
        Menus = brackets.getModule("command/Menus");
    
    var file, fileEntry, settings;
    
    file = FileUtils.getNativeModuleDirectoryPath(module) + "/settings.json";
    fileEntry = new FileSystem.getFileForPath(file);
    
    function changeSettings() {
        // first we change the check in the menu, then update the settings, refresh the editor to apply changes
        CommandManager.get("disableAutoCloseTags").setChecked(settings.disableAutoCloseTags);
        // pflynn pointed out a bug in CodeMirror requiring this null setting before applying the changes
        EditorManager.getCurrentFullEditor()._codeMirror.setOption("autoCloseTags", null);
        EditorManager.getCurrentFullEditor()._codeMirror.setOption("autoCloseTags", {indentTags: [], whenClosing: true, whenOpening: !settings.disableAutoCloseTags});
        EditorManager.getCurrentFullEditor().refresh();
    }
    
    function getSettings() {
        // settings hasn't been loaded? get them before continuing
        // otherwise just move forward
        if (!settings) {
            var readPromise = FileUtils.readAsText(fileEntry);
            readPromise.done(function (text) {
                if (text) {
                    settings = $.parseJSON(text);
                    changeSettings();
                }
            }).fail(function (error) {
                console.log(error);
                settings = {"disableAutoCloseTags": false};
            });
        } else {
            changeSettings();
        }
    }
    
    function action() {
        // save the new choice and move forward
        var writeSettings;
        if (CommandManager.get("disableAutoCloseTags").getChecked()) {
            settings = {"disableAutoCloseTags": false};
            writeSettings = "{\"disableAutoCloseTags\": false}";
        } else {
            settings = {"disableAutoCloseTags": true};
            writeSettings = "{\"disableAutoCloseTags\": true}";
        }
        var writePromise = FileUtils.writeText(fileEntry, writeSettings);
        writePromise.done(function () {
            getSettings();
        }).fail(function (error) {
            console.log(error);
        });
    }
    
    $(EditorManager).on("activeEditorChange", function () {
        if (EditorManager.getCurrentFullEditor()) {
            getSettings();
        }
    });
    
    CommandManager.register("Disable AutoClose Tags", "disableAutoCloseTags", action);
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem("disableAutoCloseTags");
    
});