import { useState } from 'react';

// utils
import { getInitialData } from '../utils';

// fragmet
import Sidebar from './Sidebar/SideBar';
import NoteListPanel from './NoteListPanel/NoteListPanel';
import NoteMainEditor from './NoteBoardPanel/NoteMainEditor';

export default function NoteApp() {
    // Grup default
    const defaultGroup = [
        { groupId: 10, groupName: 'Default', groupContent: getInitialData() },
        { groupId: 20, groupName: 'Favorites', groupContent: [] },
        { groupId: 30, groupName: 'Archived Notes', groupContent: [] },
        { groupId: 40, groupName: 'Trash', groupContent: [] },
        { groupId: 50, groupName: 'Recents', groupContent: [] },
    ];

    // state
    const [groups, setGroups] = useState(defaultGroup);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [searchedNotes, setSearchedNotes] = useState(null);

    // FINISHED create Groups
    function handleCreateGroup() {
        const groupName = prompt('Masukkan nama folder baru');
        const newGroup = [
            ...groups,
            { groupId: +new Date(), groupName: groupName || 'Undefined', groupContent: [] },
        ];
        setGroups(newGroup);
        setSelectedGroupId(newGroup[newGroup.length - 1].groupId); // Pilih group baru secara otomatis
        setNotes(newGroup[newGroup.length - 1].groupContent);
    }

    // FINISHED Selected Group
    function handleSelectGroupClick(groupId) {
        setSelectedGroupId(groupId);
        const selectedGroup = groups.find((group) => group.groupId === groupId);
        if (selectedGroup && selectedGroup.groupName !== 'Recents') {
            setNotes(selectedGroup.groupContent);
            setSearchedNotes(null);
        }
    }

    // TODO delete group
    const handleDeleteGroup = (groups, groupId) => {
        const nonDeletableGroups = ['Favorites', 'Trash', 'Recents', 'Archived Notes'];
        const groupToDelete = groups.find((group) => group.groupId === groupId);
        if (groupToDelete && !nonDeletableGroups.includes(groupToDelete.groupName)) {
            const notesToTrash = groupToDelete.groupContent;

            return groups
                .filter((group) => group.groupId !== groupId)
                .map((group) => {
                    if (group.groupName === 'Trash') {
                        return {
                            ...group,
                            groupContent: [...group.groupContent, ...notesToTrash],
                        };
                    }
                    return group;
                });
        }
        return groups;
    };

    // FINISHED create notes
    function handleCreateNote() {
        const nonCreatableNoteInGroups = ['Favorites', 'Trash', 'Recents', 'Archived Notes'];
        if (!selectedGroupId) {
            const createGroupConfirm = confirm(
                'Anda belum memilih folder, ingin membuat folder baru?'
            );
            if (createGroupConfirm) {
                handleCreateGroup();
            }
        } else if (
            nonCreatableNoteInGroups.includes(
                groups.find((group) => group.groupId === selectedGroupId).groupName
            )
        ) {
            alert('Anda tidak dapat membuat note di folder ini');
        } else {
            const newNote = {
                id: +new Date(),
                title: 'Undefined',
                body: null,
                createdAt: new Date().toISOString(),
                archived: false,
            };
            const updatedGroups = groups.map((group) => {
                if (group.groupId === selectedGroupId) {
                    return {
                        ...group,
                        groupContent: [...group.groupContent, newNote],
                    };
                }
                return group;
            });
            setGroups(updatedGroups);
            setSelectedNoteId(null);
            setNotes((prevNotes) => {
                return [...prevNotes, newNote];
            });
        }
    }

    // FINISHED Selected Note
    function handleSelectNoteClick(noteId) {
        setSelectedNoteId(noteId);

        const selectedNote = notes.find((note) => note.id === noteId);
        const selectedGroupName = groups.find(
            (group) => group.groupId === selectedGroupId
        )?.groupName;

        if (selectedNote) {
            if (selectedGroupName === 'Recents' && selectedNote.sourceGroupName) {
                const sourceGroup = groups.find(
                    (group) => group.groupName === selectedNote.sourceGroupName
                );
                if (sourceGroup) {
                    setSelectedGroupId(sourceGroup.groupId);
                    setNotes(sourceGroup.groupContent);
                }
            } else {
                const updatedGroups = handleDisplayRecentNotes(
                    groups,
                    selectedGroupName,
                    selectedNote
                );
                setGroups(updatedGroups);
            }
        }
    }

    // FINISHED edit notes
    function handleEditNote(noteId, updatedData) {
        const updatedGroups = groups.map((group) => {
            if (group.groupId === selectedGroupId) {
                return {
                    ...group,
                    groupContent: group.groupContent.map((note) =>
                        note.id === noteId ? { ...note, ...updatedData } : note
                    ),
                };
            }
            return group;
        });

        setGroups(updatedGroups);
        setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === noteId ? { ...note, ...updatedData } : note))
        );
        setSelectedNoteId(null);
    }

    // FINISHED moved notes between group
    function handleMoveNoteBetweenGroups(sourceGroupId, targetGroupId, noteId) {
        let noteToMove = null;
        const updatedGroups = groups.map((group) => {
            if (group.groupId === sourceGroupId) {
                noteToMove = group.groupContent.find((note) => note.id === noteId);
                return {
                    ...group,
                    groupContent: group.groupContent.filter((note) => note.id !== noteId),
                };
            }
            return group;
        });

        const finalGroups = updatedGroups.map((group) => {
            if (group.groupId === targetGroupId && noteToMove) {
                return {
                    ...group,
                    groupContent: [...group.groupContent, noteToMove],
                };
            }
            return group;
        });
        setGroups(finalGroups);
        setSelectedGroupId(null);
        setSelectedNoteId(null);
        setNotes([]);
    }
    // FINISHED archiving notes
    function handleArchiveNote(groupId, noteId) {
        let noteToArchive = null;
        const updatedGroups = groups.map((group) => {
            if (group.groupId === groupId) {
                noteToArchive = group.groupContent.find((note) => note.id === noteId);
                return {
                    ...group,
                    groupContent: group.groupContent.filter((note) => note.id !== noteId),
                };
            }
            return group;
        });

        const finalGroups = updatedGroups.map((group) => {
            if (group.groupName === 'Archived Notes' && noteToArchive) {
                noteToArchive = { ...noteToArchive, archived: true };
                return {
                    ...group,
                    groupContent: [...group.groupContent, noteToArchive],
                };
            }
            return group;
        });

        setGroups(finalGroups);
        setSelectedGroupId(null);
        setSelectedNoteId(null);
        setNotes([]);
    }

    // FINISHED delete notes permanently
    function handlePermanentDeleteNote(groupId, noteId) {
        const updatedGroups = groups.map((group) => {
            if (group.groupId === groupId) {
                return {
                    ...group,
                    groupContent: group.groupContent.filter((note) => note.id !== noteId),
                };
            }
            return group;
        });

        setGroups(updatedGroups);

        // Reset the selected note if the deleted note was selected
        if (selectedNoteId === noteId) {
            setSelectedNoteId(null);
        }

        // Update the notes state if the current group is the one being modified
        if (selectedGroupId === groupId) {
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        }
    }

    // FINISHED display recently opened notes
    function handleDisplayRecentNotes(groups, sourceGroupName, note) {
        const recentGroup = groups.find((group) => group.groupName === 'Recents');
        if (recentGroup) {
            const updatedRecents = [
                { ...note, accessedAt: new Date().toISOString(), sourceGroupName },
                ...recentGroup.groupContent.filter((n) => n.id !== note.id),
            ].slice(0, 3);

            return groups.map((group) =>
                group.groupName === 'Recents' ? { ...group, groupContent: updatedRecents } : group
            );
        }
        return groups;
    }
    // const handleDisplayRecentNotes = (groups, note) => {
    //     const recentGroup = groups.find((group) => group.groupName === 'Recents');
    //     if (recentGroup) {
    //         const updatedRecents = [
    //             { ...note, accessedAt: new Date().toISOString() },
    //             ...recentGroup.groupContent.filter((n) => n.id !== note.id),
    //         ].slice(0, 3);

    //         return groups.map((group) =>
    //             group.groupName === 'Recents' ? { ...group, groupContent: updatedRecents } : group
    //         );
    //     }
    //     return groups;
    // };

    // FINISHED Searched Note
    function handleSearchNote(query) {
        if (query.trim() === '') {
            setSearchedNotes(null);
        } else {
            const excludedGroups = ['Trash', 'Recents'];

            const allNotes = groups
                .filter((group) => !excludedGroups.includes(group.groupName))
                .flatMap((group) => group.groupContent);

            const filteredNotes = allNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(query.toLowerCase()) ||
                    note.body.toLowerCase().includes(query.toLowerCase())
            );
            setSearchedNotes(filteredNotes);
        }
    }

    function handleSearchedNoteClick(noteId) {
        const foundNote = groups
            .flatMap((group) =>
                group.groupContent.map((note) => ({ ...note, groupId: group.groupId }))
            )
            .find((note) => note.id === noteId);

        if (foundNote) {
            setSelectedNoteId(noteId);
            setSelectedGroupId(foundNote.groupId);
            const sourceGroup = groups.find((group) => group.groupId === foundNote.groupId);
            if (sourceGroup) {
                setNotes(sourceGroup.groupContent);
                setSearchedNotes(null);
            }
        }
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
                        notes={searchedNotes || notes}
                        searchedNotes={searchedNotes}
                        selectedNoteId={selectedNoteId}
                        handleSelectNoteClick={
                            searchedNotes ? handleSearchedNoteClick : handleSelectNoteClick
                        }
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                    />
                </div>
            </div>
            {/* Main Editor Panel */}
            <div className="flex flex-col items-center w-3/5 h-screen">
                <NoteMainEditor
                    notes={notes}
                    selectedNoteId={selectedNoteId}
                    handleEditNote={handleEditNote}
                    handleArchiveNote={handleArchiveNote}
                    handlePermanentDeleteNote={handlePermanentDeleteNote}
                    groups={groups}
                    selectedGroupId={selectedGroupId}
                    handleMoveNoteBetweenGroups={handleMoveNoteBetweenGroups}
                />
            </div>
        </div>
    );
}
