// ---- Define your dialogs  and panels here ----
function indexRedirect() {
    var url = window.location.href
    if (url.includes('student_index.html') == false && url.includes('index.html') == false){
        window.location.href += 'student_index.html';
    }
  }

// sidepanel
let dict = { 
    'remove_direct_permission': '<div><ol><li>Click the lock next to <strong>important_file.txt. </strong></li><li>Click employee3. </li><li>Look under the Deny column and check <strong>"Write" & "Modify"</strong>.</li><li>Click <strong>OK</strong> and you are done!</li></ol></div>', 
    'add_new_user':'<div><ol><li>Click the lock next to the <strong>presentation_documents</strong> folder.</li><li>Press the <strong>Add</strong> button.</li><li>Select <strong>employee4</strong> and hit <strong>OK</strong>.</li><li>On the list of users scroll then select <strong>employee4</strong>.</li><li>Check the <strong>"Read", "Write" and "Modify"</strong> boxes under the <strong>Allow</strong> header.</li><li>Click <strong>OK</strong> and  you are done!</li></ol></div>', 
    'add_full_permissions': '<div><ol><li>Click the lock next to the <strong>presentation_documents</strong> folder.</li><li>Press the <strong>Add</strong> button.</li><li>Select <strong>new_manager</strong> and click <strong>OK</strong>.</li><li>On the list of users, scroll then select <strong>new_manager</strong>.</li><li>Check the <strong>"Full_control"</strong> box under the <strong>Allow</strong> header.</li><li>Click <strong>OK</strong> and you are done!</li></ol></div>',
    'remove_inherited_permission': '<div><ol><li>Click the lock next to <strong>important_file.txt</strong>.</li><li>Click <strong>employee3</strong>.</li><li>Look under the <strong>Deny</strong> column and check <strong>"Write" & "Modify"</strong>.</li><li>Click <strong>OK</strong> and you are done!</li></ol></div>',
    'intern_permissions': '<div><ol><li>Click the lock next to the <strong>intern_subproject</strong> folder.</li><li>Click the <strong>More Options</strong> button.</li><li>Click the <strong>Edit</strong> button.</li><li>Click the <strong>Change</strong> button.</li><li>Click <strong>Intern</strong> & then <strong>OK</strong>.</li><li>Under the <strong>Allow</strong> header, check <strong>"create files/write data", "create folders/append data", and "write attributes & write extended attribute".</strong></li><li>Under <strong>Deny</strong>, check <strong>"delete subfolders" and "files & delete"</strong>.</li><li>Click the <strong>OK</strong> button to close the modal.</li><li>Click the <strong>OK</strong> button and you are done!</li></ol></div>',
    'remove_user_with_inheritance': '<div><ol><li>Click the lock next to <strong>important_file.txt. </strong></li><li>Click the <strong>More Options</strong> button.</li><li>Uncheck <strong>"Include inheritable permissions from this objects parent"</strong>.</li><li>Click <strong>Add.</strong></li><li>Click <strong>OK.</strong></li><li>Under <strong>"Group or user names:"</strong> click <strong>employee3</strong>.</li><li>Click <strong>Remove</strong>.</li><li>Click <strong>Yes</strong>.</li><li>Click the <strong>OK</strong> button and you are done!</li></ol></div>',
    'restrict_group_member': '<div><ol><li>Click the lock next to <strong>important_file.txt.</strong></li><li>Click the <strong>Add</strong> button.</li><li>Click <strong>employee3</strong> and click the <strong>OK</strong> button.</li><li>Under <strong>"Group or user names:"</strong> click <strong>employee3</strong>.</li><li>Under the <strong>Deny</strong> column, check <strong>"Write" and "Modify"</strong>.</li><li>Click the <strong>OK</strong> button and you are done!</li></ol></div>',
    'let_ta_modify': '<div><ol><li>Click the lock next to the <strong>Lecture_Notes</strong> folder.</li><li>Click the <strong>More Options</strong> button.</li><li>Check the <strong>"Replace all child object permissions with inheritable permissions from this object" </strong> box.</li><li>Click <strong>Yes</strong>.</li><li>Click <strong>OK</strong>.</li><li>Click the <strong>OK</strong> button and you are done!</li></ol></div>',
    'lost_inheritance': '<div><ol><li>Click the lock next to the <strong>Lecture_Notes</strong> folder.</li><li>Click the <strong>More Options</strong> button</li><li>Check the <strong>"Replace all child object permissions with inheritable permissions from this object"</strong> box.</li><li>Click <strong>Yes</strong>.</li><li>Click  <strong>OK</strong>.</li><li>Click the <strong>OK</strong> button and you are done!</li></ol></div>',
};

const t = window.location.href.split('=')[1];
let help = dict[t];
$('#sidepanel').append('<div id ="instructions"><h3>Instructions</h3>' + help + '</div>');

$('#sidepanel').append('<button class="check_bttn" onclick="validate()" data-bs-toggle="modal" data-bs-target="#validateModal"> Check Answer </button>')


//i-icons
function toggleDialog(icon){
    d.dialog('open');

    filepath_obj = path_to_file[$('#permissions').attr('filepath')];
    username_obj = all_users[$('#permissions').attr('username')];

    action_allowed = allow_user_action(filepath_obj, username_obj, $(icon).attr('permission_name'), true);
    let explainer = get_explanation_text(action_allowed);
    d.text(explainer);
}

//Selected file
function getFile(file_obj){
    $('#permissions').attr('filepath', file_obj.id.replace('_div',''))
    $('#file_div').remove()
    $('#sidepanel').append(`<div id="file_div"> > ${file_obj.textContent}</div>`)
}

//Validation function
function validate(){
    document.getElementById("deny-accordion").hidden = false
    document.getElementById("allow-accordion").hidden = false
    $('[id=allow-li]').remove()
    $('[id=deny-li]').remove()
    let deny_mistakes, allow_mistakes = validate_and_get_logs()

    if (allow_mistakes != null || deny_mistakes != null){
        $('#validate-header').text("❌ Your current solution is wrong.")
        $('#validate-status').text("Keep trying though! See your mistakes below:")  
    } else {
        $('#validate-header').text("✔️ Your current solution is correct!")
        $('#validate-status').text("Go ahead and submit the MTurk!")
        $('#allow-accordion').remove()
        $('#deny-accordion').remove()
    }

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