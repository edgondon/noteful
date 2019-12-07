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
                    <label for htmlFor='content'>
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
                    <label for htmlFor='content'>
                        New Note Folder<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <select>
                        {this.context.folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
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





























