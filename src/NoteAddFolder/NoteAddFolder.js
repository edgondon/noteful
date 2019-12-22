import React, { Component } from 'react'

import CircleButton from '../CircleButton/CircleButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../App/ApiContext'
import { findNote, findFolder } from '../notes-helpers'
import './NoteAddFolder.css'

import config from '../App/config';


export default class NoteAddFolder extends Component {
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
        // get the form fields from the eventss
        console.log('handledSubmit')
        const { name } = e.target
        const newa = {
            name: name.value
        }
        console.log(newa)
        this.setState({ error: null })
        fetch(config.API_ENDPOINT + `/folders`, {
            method: 'POST',
            body: JSON.stringify(newa),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {

                if (!res.ok) {
                    // get the error message from the response,
                    return res.json().then(error => {
                        //then throw it
                        throw error
                    })
                }
                return res.json()

            })
            .then(data => {
                name.value = ''

                this.context.addFolder(data)
            })
            .catch(error => {
                this.setState({ error })
            })
            this.props.history.goBack()
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
                <form className='zorm' onSubmit={this.handleSubmit}>
                    <div className='AddFolder__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <label htmlFor='name'>
                        New Folder Title<span>&nbsp;&nbsp;&nbsp;</span>

                    </label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Ludicrous'
                        required
                    />
                    <div className='AddFolder__buttons'>
                        <button type='submit'>Submit</button>
                    </div>


                </form>
            </div>

        )
    }
}
