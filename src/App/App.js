import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import NoteAddFolder from '../NoteAddFolder/NoteAddFolder';
import NoteAddNote from '../NoteAddNote/NoteAddNote';


import './App.css';
import config from './config';
import ApiContext from './ApiContext';
import CompError1 from './CompError1';


class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
    
       Promise.all([
           fetch(`${config.API_ENDPOINT}/notes`),
           fetch(`${config.API_ENDPOINT}/folders`)
       ])

        .then(([notesRes, foldersRes]) => {
            if (!notesRes.ok)
                return notesRes.json().then(e => Promise.reject(e));
            if (!foldersRes.ok)
                return foldersRes.json().then(e => Promise.reject(e));

            return Promise.all([notesRes.json(), foldersRes.json()])
        })
        .then(([notes, folders]) => {
            this.setState({notes, folders})
        })
        .catch(error => {
            console.error({error})
        })
    };

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    addFolder = folder => {
        this.setState({
            folders: [ ...this.state.folders, folder ],
        })
       

    };

    addNote = note => {
        this.setState({
            notes: [ ...this.state.notes, note ],
        })
       

    };

    renderNavRoutes() {
        
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                        
                    />
                ))}
                <CompError1>
                <Route path="/note/:noteId" component={NotePageNav} />
                </CompError1>
                    
                <CompError1>
                <Route path="/add-folder" component={NoteAddFolder} />
                </CompError1>
                <CompError1>
                <Route path="/add-note" component={NoteAddNote} />
                </CompError1>
               
            </>
        );
    }

    renderMainRoutes() {
       
        return (
            <>
                <CompError1>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                        
                    />
                ))}
                </CompError1>
                <CompError1>
                <Route
                    path="/note/:noteId" component={NotePageMain}
                    
                />
                </CompError1>
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.addFolder,
            addNote: this.addNote,
        }
        return (
            <ApiContext.Provider value={value}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
            </ApiContext.Provider>
        );
    }

} 

export default App;
