import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import auth0 from "./auth1";
// import { signin } from "./api-auth";
import { useUser, createUser, updateUser } from "./db";
// import { useUser, createUser, updateUser } from "./api-auth";
import { CustomError } from "./util";
import { history } from "./router";
import PageLoader from "./../components/PageLoader";
import { getFriendlyPlanId } from "./prices";

const allProviders = [
  {
    id: "myAuth",
    name: "myAuth",
  },
  {
    id: "auth0",
    name: "password",
  },
  {
    id: "google-oauth2",
    name: "google",
  },
  {
    id: "facebook",
    name: "facebook",
  },
  {
    id: "twitter",
    name: "twitter",
  },
  {
    id: "github",
    name: "github",
  },
];

// Whether to merge extra user data from database into auth.user
const MERGE_DB_USER = true;

const authContext = createContext();

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  // alert(`create context with ${JSON.stringify(auth)}`)
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Provider hook that creates auth object and handles state
function useAuthProvider() {
  // Store auth user object
  const [user, setUser] = useState(null);

  // Format final user object and merge extra data from database
  // const finalUser = { ...user };
  // const finalUser = usePrepareUser(user);


  // Handle response from authentication functions
  const handleAuth = async (user) => {
    // Create the user in the database
    // Auth0 doesn't indicate if they are new so we attempt to create user every time
    // await createUser(user.sub, { email: user.email });

    // Update user in state
    setUser(user);
    return user;
    // return null;
  };

  const signup = (email, password) => {
    return handleAuth({
      email: email,
      password: password,
    })
  };

  const signin = async (userCredentials = { email: '', pass: '' }) => {

    let jwtObject;
    try {
      let response = await fetch('/api/auth/signin/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userCredentials)
      })
      jwtObject = await response.json()
    } catch (err) {
      console.log(err)
    }
    // props.onAuth(res.payload || {});
    setUser(jwtObject.payload.user);
    return { ...jwtObject.payload.user };
  };


  useEffect(() => {
    // Subscribe to user on mount
    // const unsubscribe = auth0.extended.onChange(async (user) => {
    //   if (user) {
    //     setUser(user);
    //   } else {
    //     setUser(false);
    //   }
    // });
    const unsubscribe = (user) => {
      setUser(false);

    };

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return {
    user,
    signup,
    signin
  };
}

// Format final user object and merge extra data from database
function usePrepareUser(user) {
  // Fetch extra data from database (if enabled and auth user has been fetched)
  const userDbQuery = useUser(MERGE_DB_USER && user && user.sub);

  // Memoize so we only create a new object if user or userDbQuery changes
  return useMemo(() => {
    // Return if auth user is null (loading) or false (not authenticated)
    if (!user) return user;

    // Data we want to include from auth user object
    let finalUser = {
      uid: user.sub,
      email: user.email,
      emailVerified: user.email_verified,
      name: user.name,
      picture: user.picture,
    };

    // Get the provider which is prepended to user.sub
    const providerId = user.sub.split("|")[0];
    // Include an array of user's auth provider, such as ["password"]
    // Components can read this to prompt user to re-auth with the correct provider
    // In the future this may contain multiple if Auth0 Account Linking is implemented.
    const providerName = allProviders.find((p) => p.id === providerId).name;
    finalUser.providers = [providerName];

    // If merging user data from database is enabled ...
    if (MERGE_DB_USER) {
      switch (userDbQuery.status) {
        case "idle":
          // Return null user until we have db data to merge
          return null;
        case "loading":
          return null;
        case "error":
          // Log query error to console
          console.error(userDbQuery.error);
          return null;
        case "success":
          // If user data doesn't exist we assume this means user just signed up and the createUser
          // function just hasn't completed. We return null to indicate a loading state.
          if (userDbQuery.data === null) return null;

          // Merge user data from database into finalUser object
          Object.assign(finalUser, userDbQuery.data);

        /** note: stripe section 
         * *********************        
         // Get values we need for setting up some custom fields below
         const { stripePriceId, stripeSubscriptionStatus } = userDbQuery.data;
 
         // Add planId field (such as "basic", "premium", etc) based on stripePriceId
         if (stripePriceId) {
           finalUser.planId = getFriendlyPlanId(stripePriceId);
         }
 
         // Add planIsActive field and set to true if subscription status is "active" or "trialing"
         finalUser.planIsActive = ["active", "trialing"].includes(
           stripeSubscriptionStatus
         );
          ************************
         */

        // no default
      }
    }

    return finalUser;
  }, [user, userDbQuery]);
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return (props) => {
    // Get authenticated user
    const auth = useAuth();

    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false) {
        history.replace("/auth/signin");
      }
    }, [auth]);

    // Show loading indicator
    // We're either loading (user is null) or we're about to redirect (user is false)
    if (!auth.user) {
      return <PageLoader />;
    }

    // Render component now that we have user
    return <Component {...props} />;
  };
};

