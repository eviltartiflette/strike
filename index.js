const requestPromise = require('request-promise')

class WrikeClient{
    constructor(token){
        this.token = token;
        this.customFields = [];
        this.contacts = [];
    }
}

function wrikeHTTP(method,path,params,token){
    return new Promise((resolve,reject)=>{
            let reqopts = {
                url:'https://www.wrike.com/api/v4' + path,
                method:method,
                headers:{
                    'Authorization': 'Bearer ' + token
                },
                qs:qsStringHelper(params),
            }

            requestPromise(reqopts)
            .then(res=>{
                resolve(JSON.parse(res).data)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

function qsStringHelper(params){
    Object.keys(params).forEach(x=>{
        if(typeof params[x] !== 'string'){
            params[x] = JSON.stringify(params[x])
        }
    })
    return params
}

/**
 * Helper function, get a custom field ID from a string
 * @async
 * @param {string} name Name of the custom field
 * @returns {string} A custom field ID
 */
WrikeClient.prototype.customFieldNameToID = async function(name){
    try {
        let customFields = await this.getCustomFields()
        for (let i = 0; i < customFields.length; i++) {
            if (name.toLocaleLowerCase() == customFields[i].title.toLocaleLowerCase()) {
                return customFields[i].id
            }
        }
        throw('Could not find a custom field with that name')
    } catch (error) {
        throw error
    }
}

/**
 * Helper function, get a contact ID from an email address
 * @async
 * @param {string} email Email address
 * @returns {string} A contact ID
 */
WrikeClient.prototype.emailToContactID = async function(email){
    try {
        let contacts = await this.getContacts()
        for (let i = 0; i < contacts.length; i++) {
            if(contacts[i].profiles && contacts[i].profiles.length > 0 && contacts[i].profiles[0].email && contacts[i].profiles[0].email == email){
                return contacts[i].id
            }
        }
        throw('Could not find a contact with this email address')
    } catch (error) {
        throw error
    }
}

/**
 * Helper function, get an email from a contact id
 * @async
 * @param {string} contactid Contact id
 * @returns {string} An email address
 */
WrikeClient.prototype.contactIDToEmail = async function(contactid){
    try {
        let contacts = await this.getContacts()
        for (let i = 0; i < contacts.length; i++) {
            if(contacts[i].id == contactid && contacts[i].profiles && contacts[i].profiles.length > 0 && contacts[i].profiles[0].email){
                return contacts[i].profiles[0].email
            }
        }
        throw('Could not find email or contact')
    } catch (error) {
        throw error
    }
}





/**
 * Return Wrike contacts info, the response will be cached
 * @async
 * {@link https://developers.wrike.com/api/v4/contacts/#query-contacts GET /contacts documentation}
 * @returns {Array} List of contacts
 */
WrikeClient.prototype.getContacts = function(){
    return new Promise((resolve,reject)=>{
        if(this.contacts.length == 0){
            wrikeHTTP('GET','/contacts',{},this.token)
            .then(res=>{
                this.contacts = res
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        }
        else{
            resolve(this.contacts)
        }
    })
}

/**
 * Return Wrike custom fields info, the response will be cached
 * @async
 * {@link https://developers.wrike.com/api/v4/custom-fields/#query-custom-fields GET /customfields documentation}
 * @returns {Array} List of custom fields
 */
WrikeClient.prototype.getCustomFields = function(){
    return new Promise((resolve,reject)=>{
        if(this.customFields.length == 0){
            wrikeHTTP('GET','/customfields',{},this.token)
            .then(res=>{
                this.customFields = res
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
        }
        else{
            resolve(this.customFields)
        }
    })
}





/**
 * Return the Wrike folders tree
 * @async
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#get-folder-tree GET /folders documentation}
 * @returns {Array} A list of folders
 */
WrikeClient.prototype.getFolderTree = function(){
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/folders',{},this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Return a Wrike folder/project
 * @async
 * @param {String} folderid Wrike folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#get-folder GET /folders/(folderid) documentation}
 * @returns {object} A Wrike folder
 */
WrikeClient.prototype.getFolder = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/folders/'+folderid,params,this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Return Wrike folders/projects from a parent folder ID
 * @async
 * @param {String} folderid Wrike parent folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#get-folder GET /folders/(folderid)/folders documentation}
 * @returns {Array} A collection of wrike folders
 */
WrikeClient.prototype.getFoldersByParentFolder = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/folders/'+folderid+'/folders',params,this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Return Wrike folders/projects from a parent space ID
 * @async
 * @param {String} folderid Wrike parent space ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#get-folder GET /sapces/(spaceid)/folders documentation}
 * @returns {Array} A collection of wrike folders
 */
WrikeClient.prototype.getFoldersByParentSpace = function(spaceid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/spaces/'+spaceid+'/folders',params,this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Create a Wrike folder/project
 * @async
 * @param {String} folderid Wrike parent folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#create-folder POST /folders/(folderid) documentation}
 * @returns {Object} The created folder
 */
WrikeClient.prototype.createFolder = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('POST','/folders/'+folderid+'/folders',params,this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Modify a Wrike folder/project
 * @async
 * @param {String} folderid Wrike folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/folders-projects/#modify-folder PUT /folders/(folderid) documentation}
 * @returns {Object} The created folder
 */
WrikeClient.prototype.updateFolder = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('PUT','/folders/'+folderid,params,this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Delete a Wrike folder/project
 * @async
 * @param {String} folderid Wrike folder ID
 * {@link https://developers.wrike.com/api/v4/folders-projects/#modify-folder DELETE /folders/(folderid) documentation}
 */
WrikeClient.prototype.deleteFolder = function(folderid){
    return new Promise((resolve,reject)=>{
        wrikeHTTP('DELETE','/folders/'+folderid,{},this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}





/**
 * Return/search Wrike tasks
 * @async
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/tasks/#query-tasks GET /tasks documentation}
 * @returns {Array} A collection of tasks
 */
WrikeClient.prototype.getTasks = function(params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/tasks',params,this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Return Wrike tasks from a parent folder ID
 * @async
 * @param {String} folderid Wrike parent folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/tasks/#query-tasks GET /folders/(folderid)/tasks documentation}
 * @returns {Array} A collection of tasks
 */
WrikeClient.prototype.getTasksByParentFolder = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/folders/'+folderid+'/tasks',params,this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Return Wrike tasks from a parent space ID
 * @async
 * @param {String} sapceid Wrike parent space ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/tasks/#query-tasks GET /spaces/(spaceid)/tasks documentation}
 * @returns {Array} A collection of tasks
 */
WrikeClient.prototype.getTasksByParentSpace = function(spaceid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('GET','/spaces/'+spaceid+'/tasks',params,this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Create a Wrike task
 * @async
 * @param {String} folerid Wrike parent folder ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/tasks/#create-task POST /folders/(folderid)/tasks documentation}
 * @returns {object} The created task
 */
WrikeClient.prototype.createTask = function(folderid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('POST','/folders/'+folderid+'/tasks',params,this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Modify a task
 * @async
 * @param {String} taskid Wrike task ID
 * @param {object} params Request parameters, as key/value pairs
 * {@link https://developers.wrike.com/api/v4/tasks/#modify-tasks PUT /tasks/(taskid) documentation}
 * @returns {object} The modified task
 */
WrikeClient.prototype.updateTask = function(taskid,params){
    if(typeof params == 'undefined'){params = {}}
    return new Promise((resolve,reject)=>{
        wrikeHTTP('PUT','/tasks/'+taskid,params,this.token)
        .then(res=>{
            resolve(res[0])
        })
        .catch(err=>{
            reject(err)
        })
    })
}

/**
 * Delete a task
 * @async
 * @param {String} taskid Wrike task ID
 * {@link https://developers.wrike.com/api/v4/tasks/#delete-tasks DELETE /tasks/(taskid) documentation}
 */
WrikeClient.prototype.deleteTask = function(taskid){
    return new Promise((resolve,reject)=>{
        wrikeHTTP('DELETE','/tasks/'+taskid,{},this.token)
        .then(res=>{
            resolve(res)
        })
        .catch(err=>{
            reject(err)
        })
    })
}


module.exports = WrikeClient;