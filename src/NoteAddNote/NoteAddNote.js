import React, { Component } from 'react'
import CircleButton from '../CircleButton/CircleButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../App/ApiContext'
import { findNote, findFolder } from '../notes-helpers'
import config from '../App/config'
import './NoteAddNote.css'


export default class NoteAddNote extends Component {

    static defaultProps = {
        history: {
            goBack: () => { }
        },
        match: {
            params: {}
        }
    }

    static contextType = ApiContext;

    state = {
        error: null,
    };


    handleSubmit = e => {
        e.preventDefault()
        console.log('handledSubmit for Note add')
        const { name, content, folderId } = e.target
        const newanote = {
            name: name.value,
            content: content.value,
            folderId: folderId.value
        }
        console.log(newanote)
        this.setState({ error: null })
        fetch(config.API_ENDPOINT + `/notes`, {
            method: 'POST',
            body: JSON.stringify(newanote),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })
        .then(res => {
            console.log(res);
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            name.value = ''
            content.value = ''
            folderId.value = ''
            this.context.addNote(data)
        })
        .catch(error => {
            this.setState({ error })
        })

    }


    render() {
        const { notes, folders, } = this.context
        const { noteId } = this.props.match.params
        const note = findNote(notes, noteId) || {}
        const folder = findFolder(folders, note.folderId)
        const { error } = this.state



        return (

 
            <div className='NotePageNav'>
                <CircleButton
                    tag='button'
                    role='link'
                    onClick={() => this.props.history.goBack()}
                    className='NotePageNav__back-button'
                >
                    <FontAwesomeIcon icon='chevron-left' />
                    <br />
                    Back
          </CircleButton>
                {folder && (
                    <h3 className='NotePageNav__folder-name'>
                        {folder.name}
                    </h3>

                )}
                <form className='norm' onSubmit={this.handleSubmit}>
                    <div className='AddNote__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <label htmlFor='name'>
                        New Note Title<span>&nbsp;&nbsp;&nbsp;</span>

                    </label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Rooster'
                        required
                    />
                    <br />
                    <label htmlFor='content' id='clabel'>
                        New Note Content<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <textarea 
                        type='text'
                        size="300"
                        rows="5"
                        name='content'
                        id='content'
                        placeholder='Write something here...'
                        required
                    />
                    <br />
                    <label htmlFor='content'>
                        Select Folder<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <select name='folderId' id='folderId'>
                        {this.context.folders.map(folder => (
                            <option key={folder.id} value={folder.id} >
                                {folder.name}
                            </option>
                        ))}

                    </select>
                    <div className='AddNote__buttons'>
                        <button type='submit'>Submit</button> 
                    </div>


                </form>
            </div>

        )
    }

































}





























