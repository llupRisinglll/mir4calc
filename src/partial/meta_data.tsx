/**
 * This file contains the gloval meta data for the website.
 * @author Luis Edward Miranda <luisedward.miranda@gmail.com>
 */

interface UserDetails {
    user: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
    },
    token: string,
    roles: string[],
    nick: string,
    joinedAt: string,
};


declare global {
    interface Window {
        showToast: (message: string) => void;
        bootstrap: any;
    }
    
    interface Element {
        replaceClass(classList: string[]): void;
    }
}



/**
 * Replace the classes of the element with the classes in the classList
 * @param classList Array of classes to be removed from the element
 * @returns void
 * example: element.removeClasses(element.classList);
 */
Element.prototype.replaceClass = function(classList: string[]) {
    // Remove all the classes from the element
    Array.from(this.classList).forEach(className => {
        this.classList.remove(className);
    });

    // Iterate through the classList and add the classes to the element
    classList.forEach(className => {
        this.classList.add(className);
    });
}

/**
 * Parse the JSON string to a UserDetails object
 * @param jsonString 
 * @returns 
 */
function parseJSON(jsonString: string | null): UserDetails | null {
    if (jsonString !== null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Invalid JSON in userDetails:", error);
            return null;
        }
    }

    return null;
}

const userDetails: string | null = localStorage.getItem("userDetails");
let userDetailsJSON: UserDetails | null = parseJSON(userDetails);

// Domain prefix for the API that is hosted on Google App Engine
const domainPrefix = '//mir4-serverless.appspot.com/api/v1/';

const JSX = {
    createElement: function (name, props) {

        // If the name is a function, then it is a component
        if (typeof name === "function") {
            return name(props);
        }
        
        var content = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            content[_i - 2] = arguments[_i];
        }
        props = props || {};
        var propsstr = Object.keys(props).map(function (key) {
            var value = props[key];
            if (key === "className")
                return `class="${value}"`;
            else
                return `${key}="${value}"`;
        }).join(" ");

        return`<${name} ${propsstr}> ${content.join("")}</${name}>`;
    },
};


function notLoggedNotice(){
    window.showToast("It seems you are not logged in. Please login to view this page! Refreshing the page in 3 seconds...");
    setTimeout(() => {
        window.location.href = "/login.html";
    }, 3000);

}

// export domainPrefix and userDetails
export { domainPrefix, userDetailsJSON, JSX, notLoggedNotice };
