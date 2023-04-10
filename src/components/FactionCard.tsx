// @ts-ignore
import {JSX} from '../partial/meta_data'; // False import, just to make the IDE happy
import FactionActionButton from './FactionActionButton';

// Create interface for the props
interface FactionCardProps {
    clanName?: string;
    description?: string;
    members_count?: number;
    role_id?: number;
    isMember?: boolean;
    hasApplied?: boolean;
}

const defaultProps: FactionCardProps = {
    clanName: "No faction name",
    description: "No description",
    members_count: 0
};

const MAX_DESCRIPTION_LENGTH = 100;

/**
 * Used to limit the description to 100 characters and add "..." at the end
 * @param description 
 * @returns 
 */
function limitDescription(description?: string): string {
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        return `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
    }

    return description ?? "No description";
}

const FactionCard = (props: FactionCardProps) => {
    let {
        clanName, 
        description, 
        members_count, 
        role_id,
        isMember,
        hasApplied
    } = {...defaultProps, ...props}; // Merge the props with the default props because compiler is STUPID as FUCK
    
    description = limitDescription(description);

    return (
        <div className="col-6" >
            <div className="card justify-content-center mb-2">
                <div className="card-body">
                    <h2 className="mb-0 text-center">
                        <span>{clanName}</span>
                    </h2>

                    <div>{description}</div>

                    <div className="float-end mt-3 members-count">
                        {members_count} members
                    </div>

                    <FactionActionButton role_id={role_id} isMember={isMember} hasApplied={hasApplied} />
                </div>
            </div>
        </div>
    )
};



export default FactionCard;