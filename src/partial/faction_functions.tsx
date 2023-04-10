/**
 * This file contains the reusable functions for faction section
 * @author Luis Edward Miranda <luisedward.miranda@gmail.com>
 */

import './meta_data'; 

const FACTION_APPLY_BTN_CLASSES: string[] = ['btn', 'btn-primary', 'mb-3', 'mt-3', 'float-start', 'applicationButton'];
const FACTION_LEAVE_BTN_CLASSES: string[] = ['btn', 'btn-danger', 'mb-3', 'mt-3', 'float-start', 'leaveFactionButton'];
const FACTION_CANCEL_BTN_CLASSES: string[] = ['btn', 'btn-warning', 'mb-3', 'mt-3', 'float-start', 'cancelApplicationButton'];

const FACTION_APPLY_ICON_CLASSES: string[] = ['far', 'fa-clipboard', 'me-2'];
const FACTION_LEAVE_ICON_CLASSES: string[] = ['fa', 'fa-times', 'me-2'];
const FACTION_CANCEL_ICON_CLASSES: string[] = ['fa', 'fa-times', 'me-2'];

const FACTION_APPLY_STRING: string = "Apply";
const FACTION_CANCEL_STRING: string = "Cancel Application";
const FACTION_LEAVE_STRING: string = "Leave Faction";

function setButtonState(target: Element, type: "Apply" | "Cancel" | "Leave") : void {
    let text: string;
    let icon: string[];
    let btnClass: string[];

    switch (type){
        case "Apply":
            text = FACTION_APPLY_STRING;
            icon = ['far', 'fa-clipboard', 'me-2'];
            btnClass = FACTION_APPLY_BTN_CLASSES;
            break;
        case "Cancel":
            text = FACTION_CANCEL_STRING;
            icon = ['fa', 'fa-times', 'me-2'];
            btnClass = FACTION_CANCEL_BTN_CLASSES;
            break;
        case "Leave":
            text = FACTION_LEAVE_STRING;
            icon = ['fa', 'fa-times', 'me-2'];
            btnClass = FACTION_LEAVE_BTN_CLASSES;
            break;
    }

    // Make sure that the target is an element before changing the text and icon
    if (target instanceof Element){
        const applicationText = target.querySelector(".applicationText");
        if (applicationText instanceof Element){
            applicationText.innerHTML = text;
        }

        const i = target.querySelector("i");
        if (i instanceof Element){
            i.replaceClass(icon);
        }

        target.replaceClass(btnClass)
    }
}



export { 
    setButtonState, 

    // Button Classes
    FACTION_APPLY_BTN_CLASSES,
    FACTION_CANCEL_BTN_CLASSES,
    FACTION_LEAVE_BTN_CLASSES,

    // Icon inside the button classes
    FACTION_APPLY_ICON_CLASSES,
    FACTION_CANCEL_ICON_CLASSES,
    FACTION_LEAVE_ICON_CLASSES,

    // Button text
    FACTION_APPLY_STRING,
    FACTION_CANCEL_STRING,
    FACTION_LEAVE_STRING

};