

export const canEditScreen = (screenName: string | undefined) => {
    //console.log("screenName", screenName);
    switch (screenName) {
        case 'my-habit-stacks':
        case 'add_edit_habitstack':
        case 'add_edit_habit':
        case 'add_edit_habitlink':
        case 'habitlinks':
            return true;
        default:
            return false;
    }
}

export const canGoToSwapScreenFunc = (screenName: string | undefined) => {
    //console.log("screenName", screenName);
    switch (screenName) {
        case 'my-habit-stacks':
        case 'add_edit_habitstack':
        case 'add_edit_habit':
        case 'add_edit_habitlink':
        case 'habitlinks':
            return true;
        default:
            return false;
    }
}