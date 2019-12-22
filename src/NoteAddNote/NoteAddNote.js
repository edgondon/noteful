import React, { Component } from 'react'
import CircleButton from '../CircleButton/CircleButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../App/ApiContext'
import { findNote, findFolder } from '../notes-helpers'
import config from '../App/config'
import './NoteAddNote.css'
import ValidationError from "./ValidationError"


export default class NoteAddNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: "",
                touched: false
            },
            datetime: new Date()
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.interval = setInterval(() => {
            // disabled console.log due to excessive logging!
            // console.log('setInterval')
            this.setState({
                datetime: new Date()
            })
            }, 1000)
        console.log(this.state.datetime)

    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }
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

    updateName(name) {
        this.setState({ name: { value: name, touched: true } })
       
    }

    updateName2(name) {
        this.setState({ name: { value: "", touched: true } })
    }

    handleSubmit = e => {
        e.preventDefault()

        const { name, content, folderId, modified } = e.target
        let newanote = {
            name: name.value,
            content: content.value,
            folderId: folderId.value,
            modified: modified.value
        }
        
        console.log(newanote);

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
                modified.value = ''
                this.context.addNote(data)
            })
            .catch(error => {
                this.setState({ error })
            })
            this.props.history.goBack()

    }


    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return "Name is required";
        }

    }

    render() {
        const { notes, folders, } = this.context
        const { noteId } = this.props.match.params
        const note = findNote(notes, noteId) || {}
        const folder = findFolder(folders, note.folderId)
        const { error } = this.state
        const nameError = this.validateName()
        const datez = this.state.datetime
        const dated = datez.toJSON()


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
                        New Note Title:<span>&nbsp;&nbsp;&nbsp;</span>

                    </label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Rooster'
                        required
                        onChange={e => this.updateName(e.target.value)}

                    />
                    {this.state.name.touched && <ValidationError message={nameError} />}
                    <br />
                    <label htmlFor='modified'>
                        Date Modified (Read Only)<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <input 
                        type='datetime-local'
                        name='modified'
                        size="25"
                        id='modified'
                        value= {dated}
                        readOnly

                    />
                    <br />

                    <label htmlFor='content' id='clabel'>
                        New Note Content:<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <textarea
                        type='text'
                        size="300"
                        rows="5"
                        name='content'
                        id='content'
                        placeholder='Write something here...'
                        required
                        onChange={(!this.state.name.touched) ? (e => this.updateName2(e.target.value)) : undefined}
                    />
                    <br />
                    <label htmlFor='content'>
                        Select Folder<span>&nbsp;&nbsp;&nbsp;</span>
                    </label>
                    <select name='folderId' id='folderId'
                        onChange={(!this.state.name.touched) ? (e => this.updateName2(e.target.value)) : undefined}
                    >
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





























