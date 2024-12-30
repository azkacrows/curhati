import { useEffect, useState } from 'react';

// fragmet
import Sidebar from './Sidebar/SideBar';
import NoteListPanel from './NoteListPanel/NoteListPanel';
import NoteMainEditor from './NoteEditorPanel/NoteMainEditor';

// utils
import {
    defaultGroup,
    createNote,
    editNote,
    deleteNote,
    createGroup,
    editGroup,
    moveNoteBetweenGroups,
    deleteGroup,
    displayRecentNotes,
    addNoteToArchived,
    addNoteToFavorites,
} from '../utils/logic';

export default function NoteApp() {
    // state
    const [groups, setGroups] = useState(defaultGroup);
    const [selectedGroupId, setSelectedGroupId] = useState(10);
    const [notes, setNotes] = useState(defaultGroup[0].groupContent);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [searchedNotes, setSearchedNotes] = useState(null);

    // FINISHED Selected Group
    useEffect(() => {
        if (selectedGroupId) {
            const selectedGroup = groups.find((group) => group.groupId === selectedGroupId);
            if (selectedGroup) {
                setNotes(selectedGroup.groupContent);
                setSearchedNotes(null);
            }
        }
    }, [selectedGroupId, groups]);

    function handleSelectGroupClick(groupId) {
        setSelectedGroupId(groupId);
    }

    // FINISHED create Groups
    function handleCreateGroup(groupName) {
        const newGroup = createGroup(groups, groupName);
        setGroups(newGroup);
        setSelectedGroupId(newGroup[newGroup.length - 1].groupId); // Pilih group baru secara otomatis
    }

    // FINISHED create notes
    function handleCreateNote(title, body) {
        const newNote = createNote(title, body);
        setNotes([...notes, newNote]);
        setSelectedNoteId(newNote.id); // Pilih note baru secara otomatis
    }

    // TODO Selected Note
    function handleSelectNoteClick(noteId) {
        setSelectedNoteId(noteId);

        const selectedNote = notes.find((note) => note.id === noteId);

        if (selectedNote) {
            // Update grup Recents dengan note yang diakses
            const updatedGroups = displayRecentNotes(groups, selectedNote);
            setGroups(updatedGroups);
        }
    }

    // TODO Searched Note
    function handleSearchNote(query) {
        const filteredNotes = notes.filter((note) =>
            note.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchedNotes(filteredNotes);
    }

    return (
        <div className="container flex min-w-full min-h-screen">
            <div className="flex flex-row w-2/5">
                {/* Sidebar Panel */}
                <div className="flex flex-col w-1/2 h-screen">
                    <Sidebar
                        selectedNoteId={selectedNoteId}
                        handleSelectNoteClick={handleSelectNoteClick}
                        handleCreateNote={handleCreateNote}
                        handleSearchNote={handleSearchNote}
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        handleCreateGroup={handleCreateGroup}
                        handleSelectGroupClick={handleSelectGroupClick}
                    />
                </div>
                {/* Note List Panel */}
                <div className="flex flex-col w-1/2 h-screen bg-base-200">
                    <NoteListPanel
                        notes={notes || searchedNotes}
                        selectedNoteId={selectedNoteId}
                        handleSelectNoteClick={handleSelectNoteClick}
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                    />
                </div>
            </div>
            {/* Main Editor Panel */}
            <div className="flex flex-col items-center w-3/5 h-screen">
                <NoteMainEditor />
            </div>
        </div>
    );
}
