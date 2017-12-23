$(document).ready(function () {
    //  localStorage.allTheStories=''
    var theColumnsnames = ["todo", "progress", "done"]; 
    var addOrChange = 'add';
    var allStories = [[], [], []];
    getFromStorage()
    //-------------------------------------------------------------------------------------------------------
    function getFromStorage() {
        if (localStorage.allTheStories) {
            allStories = JSON.parse(localStorage.allTheStories);
            console.log(allStories)
            for (var i = 0; i < 3; i++)
                for (j = 0; j < allStories[i].length; j++)
                    newStory(allStories[i][j], theColumnsnames[i])
        }
    }
    //-------------------------------------------------------------------------------------------------------
    function updateStorage() {
        allStories = [[], [], []];
        for (var i = 0; i < 3; i++) {
            $('.columns.' + theColumnsnames[i]).children('.Astory').each(function () {
                allStories[i].push($(this).data('details'))
            })
        }
        localStorage.allTheStories = JSON.stringify(allStories)
    }
    //-------------------------------------------------------------------------------------------------------
    function newStory(theObj, theColumn) {
        var Astory = $('<div>').addClass('Astory');
        Astory.data('details', theObj)
        Astory.append($('<h1>').addClass('storyHead').attr("title", theObj['description']).html(theObj['title'] + "(" + theObj['priority'] + ")"))
        Astory.append($('<SPAN>').addClass('ui-icon ui-icon-pencil butts'))
        Astory.append($('<SPAN>').addClass('storydate').html(theObj['due_date']))
        Astory.append($('<SPAN>').addClass('ui-icon ui-icon-trash butts'))
        $('.columns.' + theColumn).append(Astory)

        $('.ui-icon-trash').click(function () {
            $(this).parent().remove();
            updateStorage()
        })

        $('.ui-icon-pencil').click(function () {
            $('#makeStory').tabs({ disabled: false })
            var details = ($(this).parent().data('details'))
            $('#addUpdateButton').text('update story')
            $('#makeStory').dialog('open')
            addOrChange = $(this).parent();
            $('#title').val(details.title)
            $('#description').val(details.description)
            $('#priority').slider('value', details.priority);
            $('#priority_level').val(details.priority)
            $('#due_date').val(details.due_date)
            if (details.comments.length == 0)
                $('#tmp').css("display", "list-item")
            else {
                for (var i = 0; i < details.comments.length; i++)
                    $('#commentsList').append($('<li>').text(details.comments[i]).addClass('Acomment').append($('<button>').addClass(' ui-icon ui-icon-close cancelComment')))
                $('#tmp').css("display", "none")
            }

            $('.cancelComment').click(function () {
                $(this).parent().remove();
                $('#commentsList li:last-child').css("display", "list-item")
            })
        })
    }
    //-------------------------------------------------------------------------------------------------------
    $('#makeStory').dialog({
        autoOpen: false,
        modal: true,
        buttons: [{
            text: "cancel",
            click: function () {
                clearFields()
                $(this).dialog('close')
            },
        },
        {
            text: "add story",
            id: "addUpdateButton",
            click: function () {
                var me = ($(this));
                var coments = [];
                $('.Acomment').each(function () {
                    coments.push($(this).text())
                })
                var theDetails = {
                    'title': $('#title').val(),
                    'description': $('#description').val(),
                    'priority': $('#priority_level').val(),
                    'due_date': $('#due_date').val(),
                    'comments': coments
                }
                if (addOrChange == 'add')
                    newStory(theDetails, $('#theSheet').data('column'));
                else {
                    addOrChange.data('details', theDetails)
                    addOrChange.children('.storyHead').attr("title", theDetails['description']).html($('#title').val() + "(" + $('#priority_level').val() + ")")
                    addOrChange.children('.storydate').html($('#due_date').val())
                }
                me.dialog('close')
                clearFields()
                updateStorage()
            }
        }]
    })
    //-------------------------------------------------------------------------------------------------------
    function clearFields() {
        $('#title').val('');
        $('#description').val('');
        $('#priority').slider('value', 1);
        $('#priority_level').val(1);
        $('#due_date').val('');
        $('#commentTextArea').val('');
        $('.Acomment').remove();
        $('#tmp').css("display", "list-item");
    }
    //-------------------------------------------------------------------------------------------------------
    $('.plus').click(function () {
        clearFields()
        $('#makeStory').tabs({ disabled: [1] })
        var addOrChange = 'add';
        $('#addUpdateButton').text('add story')
        $('#theSheet').data('column', $(this).parent().parent().attr("id"))
        console.log($('#theSheet').data('column'))
        $('#makeStory').dialog('open');
    })
    //-------------------------------------------------------------------------------------------------------
    $('#saveComment').click(function () {
        $('#commentsList').append($('<li>').text($(this).siblings('#commentTextArea').val()).addClass('Acomment').append($('<button>').addClass(' ui-icon ui-icon-close cancelComment')))
        $(this).siblings('#commentTextArea').val('');
        // console.log($('#tmp').css("display"))
        $('#tmp').css("display", "none")

        $('.cancelComment').click(function () {
            $(this).parent().remove();
            $('#commentsList li:last-child').css("display", "list-item")
        })
    })
    //-------------------------------------------------------------------------------------------------------
    $(document).tooltip();
    $("#commentsList").sortable();
    $("#commentsList").disableSelection();
    $('#makeStory').tabs({ disabled: [1] });
    $('#due_date').datepicker();
    $(".columns").sortable({ connectWith: ".columns", items: "div:not(.column_head)", stop: function () { updateStorage() } }).disableSelection();
    $('#priority').slider({
        min: 1, max: 10, value: 1,
        slide: function (event, ui) {
            $('#priority_level').val(ui.value);
        }
    });

})