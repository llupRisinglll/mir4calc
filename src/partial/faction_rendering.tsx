import axios from 'axios';

// import userDetails and domainPrefix from src/partial/meta_data.tsx
import { domainPrefix, userDetailsJSON, JSX, notLoggedNotice } from './meta_data';

import FactionCard from '../components/FactionCard';

(async () => {
    const factionEndpoint = domainPrefix + 'factions';

    // Make sure the user is logged in before making the request, otherwise redirect to login page
    if (userDetailsJSON === null) {
        notLoggedNotice()
        return false; // Return false to stop the execution of the function
    }
	
    try {
        const factions = await axios.get(factionEndpoint, {
            headers: { 
                'x-access-token': userDetailsJSON.token 
            }
        });


        if (Boolean(factions.data.isSuccess) === false){
            window.showToast("Something went wrong. Please refresh the page!");
            return;
        }

        /** @jsx template */

        // loop through the response.data and append to #v-pills-faction
        factions.data.data.forEach(function(faction, i) {
            const factionContainer = document.querySelector("#v-pills-faction>div");

            //remove loading...
            if (i === 0){
                factionContainer.innerHTML = "";
            }
            
            // append react template to the DOM
            factionContainer.innerHTML += <FactionCard 
                clanName={faction.name}
                role_id={faction.roleid}
                description={faction.description}
                members_count={faction.members_count}
                isMember={faction.isMember}
                hasApplied={faction.hasApplied}
            />;

        });
		
    } catch (error) {
        window.showToast("Something went wrong. Please refresh the page!");
        console.error(error);
        return;
    }

})();