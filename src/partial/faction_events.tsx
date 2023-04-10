/**
 * @file faction_events.tsx
 * This file contains the event handlers for faction section
 * @author Luis Edward Miranda <luisedward.miranda@gmail.com>
 */

import { domainPrefix, notLoggedNotice, userDetailsJSON } from './meta_data';
import axios from 'axios';
import {setButtonState} from './faction_functions';

// change the event listener to target #v-pills-faction instead of .applicationButton
document.querySelector("#v-pills-faction").addEventListener("click", async function(event) {
    // check if the clicked element has class applicationButton

    let target = event.target as Element;
    const parent = target.parentElement;

    // if event.target is not a button, then it's a child of a button
    if (target.tagName !== "BUTTON" && parent && parent.tagName === 'BUTTON'){
        target = parent;
    }

    const applyEndPoint = domainPrefix + 'faction/apply';
    const cancelEndPoint = domainPrefix + 'faction/cancel';
    const leaveEndpoint = domainPrefix + "faction/leave";

    
    // Make sure the user is logged in before making the request, otherwise redirect to login page
    if (userDetailsJSON === null) {
        notLoggedNotice();
        return false; // Return false to stop the execution of the function
    }

    if (target.matches(".applicationButton")) {
        const dataId = target.getAttribute("data-id");

        // Create a loading experience
        target.querySelector(".applicationText").innerHTML = "Applying...";
        target.querySelector("i").replaceClass( ['fa', 'fa-spinner', 'fa-spin', 'me-2']);
        target.setAttribute("disabled", "true");  // Disable the button

        try {
            const response = await axios.post(applyEndPoint, { faction: dataId }, {
                headers: {
                    'x-access-token': userDetailsJSON.token
                }
            });

            // if status code is 401 or 403, then the user is not logged in
            if (response.status === 401 || response.status === 403){
                notLoggedNotice();
                return;
            }

            if (Boolean(response.data.isSuccess) === false){
                window.showToast(response.data.message);

                // Bring back the original text
                setButtonState(target, "Apply");
                return;
            }else{
                // Change the button text to "Cancel Application"
                setButtonState(target, "Cancel");
            }

        } catch (error) {
            // Bring back the original text
            setButtonState(target, "Apply");
			
            window.showToast("Something went wrong. Please refresh the page!");
        } finally{
            target.removeAttribute("disabled"); // Enable the button
        }

        return false;
    }

    // check if the clicked element has class cancelApplicationButton
    if (target.matches(".cancelApplicationButton")) {
        console.log("Has been triggered");

        // Create a loading experience
        target.querySelector(".applicationText").innerHTML = "Cancelling...";
        target.querySelector("i").replaceClass( ['fa', 'fa-spinner', 'fa-spin', 'me-2']);
        target.setAttribute("disabled", "true"); // Disable the button

        const dataId = target.getAttribute("data-id");

        try {
            const response = await axios.post(cancelEndPoint, { faction: dataId }, {
                headers: {
                    'x-access-token': userDetailsJSON.token
                }
            });

            // if status code is 401 or 403, then the user is not logged in
            if (response.status === 401 || response.status === 403){
                notLoggedNotice();
                return;
            }

            if (Boolean(response.data.isSuccess) === false){
                window.showToast(response.data.message);

                // Bring back the original text
                setButtonState(target, "Cancel");
            }else{
                setButtonState(target, "Apply");
            }

        }
        catch (error){
            // Bring back the original text
            setButtonState(target, "Cancel");
			
            window.showToast("Something went wrong. Please refresh the page!");
        }
        finally{
            target.removeAttribute("disabled"); // Enable the button
        }

        return false;
    }

    // check if the clicked element has class leaveFactionButton
    if (target.matches(".leaveFactionButton")) {
        const modal = document.querySelector("#staticBackdrop");

        // add the id to the modal
        modal.setAttribute("data-id", target.getAttribute("data-id"));

        // function to remove data-id attribute from modal
        const removeDataId = (): void => {
            modal.removeAttribute("data-id");
        }

        const dataId = target.getAttribute("data-id");
		
        const leaveFaction = async () => {
            target.setAttribute("disabled", "true");  // Disable the button

            // Change the text of the .modal-confirm button to "Leaving..." and change the icon
            modal.querySelector(".modal-confirm").innerHTML = "Leaving...";
			
            // Disable the button
            modal.querySelector(".modal-confirm").setAttribute("disabled", "true");
            modal.querySelector(".modal-close").setAttribute("disabled", "true");
            modal.querySelector(".btn-close").setAttribute("disabled", "true");

            try {
                const response = await axios.post(leaveEndpoint, { faction: dataId }, {
                    headers: {
                        'x-access-token': userDetailsJSON.token
                    }
                });

                // if status code is 401 or 403, then the user is not logged in
                if (response.status === 401 || response.status === 403){
                    notLoggedNotice();
                    return;
                }

                if (Boolean(response.data.isSuccess) === false){
                    window.showToast(response.data.message);

                    // Bring back the original text
                    setButtonState(target, "Leave");
                    return;
                }else{
                    // Change the button text to "Apply"
                    setButtonState(target, "Apply");
                    modal.querySelector(".btn-close").removeAttribute("disabled");

                    // remove this attribute to the button, data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                    target.removeAttribute("data-bs-toggle");
                    target.removeAttribute("data-bs-target");
                }

            } catch (error) {
                // Bring back the original text
                setButtonState(target, "Leave");

                setTimeout(function () {
                    window.showToast("Something went wrong while trying to send the request! Please try again later");
                }, 1000);
            } finally {
                // close boostrap modal programmatically not by clicking the button
                window.bootstrap.Modal.getInstance(modal).hide();
                target.removeAttribute("disabled"); // Enable the button
            }
        }

        // add event listener to modal for when it's closed
        modal.addEventListener("hidden.bs.modal", function(event) {
            removeDataId();

            // Bring back the original text
            modal.querySelector(".modal-confirm").innerHTML = "Yes, I am sure";
            
            // enable the button
            modal.querySelector(".modal-confirm").removeAttribute("disabled");
            modal.querySelector(".modal-close").removeAttribute("disabled");

            // remove the event listener
            modal.removeEventListener("hidden.bs.modal", removeDataId);
        });

        modal.querySelector(".modal-confirm").addEventListener("click", function(event) {
            leaveFaction();

            // remove the event listener 
            modal.removeEventListener("hidden.bs.modal", removeDataId);

            modal.querySelector(".modal-confirm").removeEventListener("click", leaveFaction);
        });

        return false;
    }
	
});