import {JSX, domainPrefix as React} from '../partial/meta_data'; // False import, just to make the IDE happy

import { 
	FACTION_APPLY_BTN_CLASSES, 
	FACTION_LEAVE_BTN_CLASSES,
	FACTION_CANCEL_BTN_CLASSES,
	
    FACTION_APPLY_ICON_CLASSES,
    FACTION_CANCEL_ICON_CLASSES,
    FACTION_LEAVE_ICON_CLASSES,

    FACTION_APPLY_STRING,
    FACTION_CANCEL_STRING,
    FACTION_LEAVE_STRING
} from '../partial/faction_functions';

interface FactionActionButtonProps {
	role_id?: number;
	isMember?: boolean;
	hasApplied?: boolean;
}


const defaultProps: FactionActionButtonProps = {
	role_id: 0,
	isMember: false,
	hasApplied: false
};

const FactionActionButton = (props: FactionActionButtonProps) => {
	const {
		role_id,
		isMember,
		hasApplied,
	} = {...defaultProps, ...props};

	
	let faLogo: string;
	let applicationText: string;

	if (isMember) {
		faLogo = FACTION_LEAVE_ICON_CLASSES.join(" ");
		applicationText = FACTION_LEAVE_STRING;
	}else if(hasApplied) {
		faLogo = FACTION_CANCEL_ICON_CLASSES.join(" ");
		applicationText = FACTION_CANCEL_STRING;
	}else {
		faLogo = FACTION_APPLY_ICON_CLASSES.join(" ");
		applicationText = FACTION_APPLY_STRING;
	}

	// Change the button classes to have the correct color and click event
	let buttonClass: string;
	if (isMember) {
		buttonClass = FACTION_LEAVE_BTN_CLASSES.join(" ");
	} else if (hasApplied) {
		buttonClass = FACTION_CANCEL_BTN_CLASSES.join(" ");
	} else {
		buttonClass = FACTION_APPLY_BTN_CLASSES.join(" ");
	}

	// Additional attributes to the button. This will be used to open the modal. A confirmation modal will be opened
	let otherProps = {};
	if (isMember) {
		otherProps = {
			"data-bs-toggle": "modal",
			"data-bs-target": "#staticBackdrop"
		}
	}

	return (
		<button className={buttonClass} data-id={role_id} {...otherProps}>
			<i className={ faLogo }></i>
			<span className="applicationText"> {applicationText}</span>
		</button>
	)
}

export default FactionActionButton;