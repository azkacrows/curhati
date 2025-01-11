export default function NoteHeaderButton({ saveEditedDataHandler }) {
    // TODO adding notes to archived array
    // const handleAddNoteToArchived = (groups, noteId) => {
    //     return handleMoveNoteBetweenGroups(groups, 10, 30, noteId); // Default to Archived Notes
    // };

    // TODO adding notes to favorite array
    // const handleAddNoteToFavorites = (groups, noteId) => {
    //     return handleMoveNoteBetweenGroups(groups, 10, 20, noteId); // Default to Favorites
    // };
    return (
        <div className="border rounded-full dropdown dropdown-end border-white/60">
            <div
                tabIndex={0}
                role="button"
                className="flex h-0 p-1 rounded-full fill-current min-h-fit btn active:opacity-30"
            >
                <box-icon size="sm" name="dots-horizontal-rounded"></box-icon>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-300 rounded-lg z-[1] w-52 p-2 shadow"
            >
                <li className="active:opacity-30">
                    <button onClick={saveEditedDataHandler}>Save Notes</button>
                </li>
                {/* <li className="active:opacity-30">
                    <a>Delete Notes</a>
                </li>
                <li className="active:opacity-30">
                    <a>Favorites Notes</a>
                </li>
                <li className="active:opacity-30">
                    <a>Archived Notes</a>
                </li>
                <li className="active:opacity-30">
                    <a>Delete Folder</a>
                </li> */}
            </ul>
        </div>
    );
}
