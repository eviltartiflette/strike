# STRIKE  
Strike is a small NodeJs API wrapper for the Wrike project management software.  
  
## Install: ##  
```
npm install https://github.com/eviltartiflette/strike.git  
```

## Usage: ##  
```js script  
const strike = require('@eviltartiflette/strike')

let wrikeClient = new strike('1234567890') //Instanciate a strike class with a Wrike permanent acces token

async function writeTemplate(){
    try {

        let createdFolder = await wrikeClient.createFolder('IEABK5AAI1231H',{
            'title':'Make a chocolate cake',
            'description':'Client ordered a chocolate cake for her friend birthday',
            'project':{
                'status':'Green',
                'ownerIds':[await wrikeClient.emailToContactID('manager@bakery.com')],
                'endDate':'2020-11-20'
            },
            'customFields':[
                {
                    'id': await wrikeClient.customFieldNameToID('Message on the icing'),
                    'value': 'Happy birthday!!!'
                },
                {
                    'id': await wrikeClient.customFieldNameToID('Client contact'),
                    'value': 'hungryclient@mailbox.com'
                }
            ]
        })  //Create a folder in the folder 'IEABK5AAI1231H', with properties and custom fields

        let firstTask = await wrikeClient.createTask(createdFolder.id,{
            'title':'Make the cake',
            'dates':{
                'due':'2020-11-19'
            },
            'responsibles':[await wrikeClient.emailToContactID('cook@bakery.com')]
        }) //Create a task in the folder we created earlier

    } catch (error) {
        throw error
    }
}

writeTemplate()
.then()
.catch(err=>{
    console.log(err)
})
```

## Functions: ##
**Every function is asynchronous, with the sole exception of stike's instanciation**
- **emailToContactID(email)**

    Find a Wrike contact ID from an email address

- **customFieldNameToID(name)**

    Find a custom field ID from its name


- **getContacts()**
  
    Returns an array of contacts of the wrike workspace, the response will be cached.

- **getCustomFields()**
  
  Returns an array of custom fields of the wrike workspace, the response will be cached.

- **getFolderTree(params)**

    Returns the folder tree, as an array of folders, optional parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#get-folder-tree ( GET /folders )

- **getFolder(folderid, params)**

    Returns a folder as an object from a folder id, optional parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#get-folder ( GET /folders/(folderid) )

- **getFoldersByParentFolder(folderid, params)**

    Returns an array of folder objects, which are children of the provided folder id, optional parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#get-folder-tree ( GET /folders/(folderid)/folders )

- **getFoldersByParentSpace(spaceid, params)**

    Returns an array of folder objects, which are children of the provided space id, optional parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#get-folder-tree ( GET /spaces/(spaceid)/folders )

- **createFolder(folderid, params)**

    Creates a folder (or a project), which will be children of the provided folder id, the created folder will be returned as an object, parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#create-folder ( POST /folders/(folderid)/folders )

- **updateFolder(folderid, params)**

    Modify an already existing folder, the modified folder will be returned as an object, parameters are detailled here : https://developers.wrike.com/api/v4/folders-projects/#modify-folder ( PUT /folders/(folderId) )

- **deleteFolder(folderid)**

    Deletes a folder

- **getTasks()**

    Returns a list of tasks as an array, optionnal parameters are detailled here : https://developers.wrike.com/api/v4/tasks/#query-tasks ( GET /tasks )

- **getTasksByParentFolder(folderid, params)**
- 
    Returns an array of tasks objects, which are children of the provided folder id, optional parameters are detailled here : https://developers.wrike.com/api/v4/tasks/#query-tasks ( /folders/(folderid)/tasks )

- **getTasksByParentSpace(spaceid, params)**

    Returns an array of tasks objects, which are children of the provided space id, optional parameters are detailled here : https://developers.wrike.com/api/v4/tasks/#query-tasks ( /spaces/(spaceid)/tasks )

- **createTask(folderid, params)**

    Create and return a task as an object, which will be children of the provided folder id, parameters are detailled here : https://developers.wrike.com/api/v4/tasks/#create-task ( POST /folders/(folderid)/tasks )

- **updateTask(taskid, params)**

    Modify an already existing task, which will be returned as an object, parameters are detailled here : https://developers.wrike.com/api/v4/tasks/#modify-tasks ( PUT /tasks/(taskid) )

- **deleteTask()**

    Deletes a task