function initEditor(els) {
    jQuery(els).each(function (index, el) {
        var isInPreviewMode = false;

        var editor = CodeMirror.fromTextArea(el, {
            mode: 'gfm',
            theme: 'default',
            extraKeys: {
                "Enter": 'newlineAndIndentContinueMarkdownList'
            },
            lineWrapping: true,
            lineNumbers: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            buttons: [
                {
                    hotkey: 'Ctrl-B',
                    class: 'bold btn btn-default',
                    label: '<i class="fa fa-bold"></i>',
                    callback: function (cm) {
                        var selection = cm.getSelection();
                        cm.replaceSelection('**' + selection + '**');
                        if (!selection) {
                            var cursorPos = cm.getCursor();
                            cm.setCursor(cursorPos.line, cursorPos.ch - 2);
                        }
                    }
                },
                {
                    hotkey: 'Ctrl-I',
                    class: 'italic btn btn-default',
                    label: '<i class="fa fa-italic"></i>',
                    callback: function (cm) {
                        var selection = cm.getSelection();
                        cm.replaceSelection('*' + selection + '*');
                        if (!selection) {
                            var cursorPos = cm.getCursor();
                            cm.setCursor(cursorPos.line, cursorPos.ch - 1);
                        }
                    }
                },
                {
                    class: 'block-code btn btn-default',
                    label: '<i class="fa fa-code"></i>',
                    callback: function (cm) {
                        var language = prompt('Language') || '';

                        var selection = cm.getSelection();
                        cm.replaceSelection("```" + language + "\n" + selection + "\n```\n");
                        if (!selection) {
                            var cursorPos = cm.getCursor();
                            cm.setCursor(cursorPos.line - 2, 0);
                        }
                    }
                },
                {
                    class: 'quote btn btn-default',
                    label: '<i class="fa fa-quote-right"></i>',
                    callback: function (cm) {
                        cm.replaceSelection("> " + cm.getSelection());
                    }
                },
                {
                    class: 'ul btn btn-default',
                    label: '<i class="fa fa-list-ul"></i>',
                    callback: function (cm) {
                        cm.replaceSelection("- " + cm.getSelection());
                    }
                },
                {
                    class: 'ol btn btn-default',
                    label: '<i class="fa fa-list-ol"></i>',
                    callback: function (cm) {
                        cm.replaceSelection("1. " + cm.getSelection());
                    }
                },
                {
                    class: 'a btn btn-default',
                    label: '<i class="fa fa-link"></i>',
                    callback: function (cm) {
                        var selection = cm.getSelection();
                        var text = '';
                        var link = '';

                        if (selection.match(/^https?:\/\//)) {
                            link = selection;
                        } else {
                            text = selection;
                        }
                        cm.replaceSelection('[' + text + '](' + link + ')');

                        var cursorPos = cm.getCursor();
                        if (!selection) {
                            cm.setCursor(cursorPos.line, cursorPos.ch - 3);
                        } else if (link) {
                            cm.setCursor(cursorPos.line, cursorPos.ch - (3 + link.length));
                        } else {
                            cm.setCursor(cursorPos.line, cursorPos.ch - 1);
                        }
                    }
                },
                {
                    class: 'img btn btn-default',
                    label: '<i class="fa fa-picture-o"></i>',
                    callback: function (cm) {
                        var url = prompt('Add image url') || '';

                        var selection = cm.getSelection();
                        cm.replaceSelection('<img src="' + url + '"' + selection + ' />');

                    }
                },
                {
                    class: 'img btn btn-default btn-preview',
                    label: '<i class="fa fa-eye"></i>',
                    callback: function (cm) {
                        var button = $('.btn-preview');
                        var wrap = $('.CodeMirror-wrap');
                        var preview = wrap.find('.CodeMirror-preview');
                        if (!preview.length) {
                            wrap.append('<div class="CodeMirror-preview"></div>');
                            preview = wrap.find('.CodeMirror-preview');
                        }

                        if (isInPreviewMode) {
                            preview.hide();
                            button.removeClass('active');
                        } else {
                            preview.show();
                            button.addClass('active');

                            $.ajax({
                                method: 'post',
                                url: '/render-markdown',
                                data: {
                                    content: cm.getValue()
                                },
                                success: function (data) {
                                    preview.html(data);
                                }
                            });
                        }
                        isInPreviewMode = !isInPreviewMode;
                    }
                },
                {
                    class: 'img btn btn-default',
                    label: '<i class="fa fa-expand"></i>',
                    callback: function (cm) {
                        jQuery('.CodeMirror').css('height', 'auto');
                    }
                },
            ]
        });
    });
}

jQuery(function ($) {
    // allow omitting <?php in codeblocks
    CodeMirror.findModeByName('php').mime = 'text/x-php';
    initEditor('.markdown-editor');
});
