// ---- Define your dialogs  and panels here ----
function indexRedirect() {
    var url = window.location.href
    if (url.includes('student_index.html') == false && url.includes('index.html') == false){
        window.location.href += 'student_index.html';
    }
  }

selected_file = "n/a"

let permissions_panel = define_new_effective_permissions("permissions", true)
let user_panel = define_new_user_select_field("new_user", "Choose User", function(selected_user) {
    $('#permissions').attr('username', selected_user) 
    $('#permissions').attr('filepath', selected_file.id.replace('_div',''))
})

$('#sidepanel').append(permissions_panel)
$('#sidepanel').append(user_panel)
$('#sidepanel').append("Selected File: ")
$('#sidepanel').append(`<div id="file_div">(Click a file to select it.)</div>`)

let d = define_new_dialog("dialog", "Permissions Info")

// $('.fa-info-circle').click(function(){
//     let a = $('#permissions').attr('filepath')
//     let b = $('#permissions').attr('username')
//     let p = $(this).attr('permission_name')
//     let c = allow_user_action(path_to_file[a],all_users[b], p)

//     console.log(a)
//     console.log(b)
//     console.log(p)
//     console.log(c)
//     })

function toggleDialog(icon){
    d.dialog('open');

    filepath_obj = path_to_file[$('#permissions').attr('filepath')];
    username_obj = all_users[$('#permissions').attr('username')];

    action_allowed = allow_user_action(filepath_obj, username_obj, $(icon).attr('permission_name'), true);
    let explainer = get_explanation_text(action_allowed);
    d.text(explainer);
}

function getFile(file_obj){
    $('#permissions').attr('filepath', file_obj.id.replace('_div',''))
    $('#file_div').remove()
    $('#sidepanel').append(`<div id="file_div"> > ${file_obj.textContent}</div>`)
}

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                    Permissions
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div onclick="getFile(this)" class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                Permissions
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 