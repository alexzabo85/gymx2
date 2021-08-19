import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "./../util/myAuth.js";
import { useForm } from "react-hook-form";
// import { signin } from '../util/api-auth.js'


function AuthForm(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const { handleSubmit, register, errors, getValues } = useForm();
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  })


  const submitHandlersByType = {
    signinMyAuth: ({ email, pass }) => {
      alert(JSON.stringify(auth))
      return auth.signin(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },

    signinAuth0: ({ email, pass }) => {
      return auth.signin(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },

    signup: ({ email, pass }) => {
      return auth.signup(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },

    forgotpass: ({ email }) => {
      return auth.sendPasswordResetEmail(email).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Password reset email sent",
        });
      });
    },

    changepass: ({ pass }) => {
      return auth.confirmPasswordReset(pass).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Your password has been changed",
        });
      });
    },

    signin: async (user) => {
      // alert(`-> ssubmitHandlersByType.signin() ${JSON.stringify(user)}`)
      let res;
      try {
        let response = await fetch('/api/auth/signin/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(user)
        })

        res = await response.json()
        return { ...res.payload };
      } catch (err) {
        console.log(err)
      }
      props.onAuth(res.payload || {});
    },

    signout: async () => {
      try {
        let response = await fetch('/api/auth/signout/', { method: 'GET' })
        return await response.json()
      } catch (err) {
        console.log(err)
      }
    }
  };

  // Handle form submission
  // const onSubmitAuth0 = ({ email, password }) => {
  //   const user = {
  //     email: email || undefined,
  //     password: password || undefined
  //   }

  //   signin(user).then((data) => {
  //     if (data.error) {
  //       setValues({ ...values, error: data.error })
  //     } else {
  //       // alert(JSON.stringify(data))
  //       auth.authenticate(data, () => {
  //         props.onAuth(user);
  //         setValues({ ...values, error: '', redirectToReferrer: true })
  //       })
  //     }
  //   })
  // };

  // Handle form submission
  const onSubmit = ({ email, pass }) => {
    // Show pending indicator
    setPending(true);

    // Call submit handler for auth type
    submitHandlersByType[props.type]({
      email,
      pass: pass,
    }).then((payload) => {
      alert(`Welcome ${JSON.stringify(payload._id)}`)
      props.onAuth(payload);
    }).catch((error) => {
      setPending(false);
      // Show error alert message
      props.onFormAlert({
        type: "error",
        message: error.message,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container={true} spacing={2}>
        {["signup", "signin", "forgotpass"].includes(props.type) && (
          <Grid item={true} xs={12}>
            <TextField
              variant="outlined"
              type="email"
              label="Email"
              name="email"
              placeholder="user@example.com"
              error={errors.email ? true : false}
              helperText={errors.email && errors.email.message}
              fullWidth={true}
              inputRef={register({
                required: "Please enter your email",
              })}
            />
          </Grid>
        )}

        {["signup", "signin", "changepass"].includes(props.type) && (
          <Grid item={true} xs={12}>
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              name="pass"
              error={errors.pass ? true : false}
              helperText={errors.pass && errors.pass.message}
              fullWidth={true}
              inputRef={register({
                required: "Please enter a password",
              })}
            />
          </Grid>
        )}

        {["signup", "changepass"].includes(props.type) && (
          <Grid item={true} xs={12}>
            <TextField
              variant="outlined"
              type="password"

              inputRef={register({
                required: "Please enter your password again",
                validate: (value) => {
                  if (value === getValues().pass) {
                    return true;
                  } else {
                    return "This doesn't match your password";
                  }
                },
              })}
            />
          </Grid>
        )}

        <Grid item={true} xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={pending}
            fullWidth={true}
          >
            {!pending && <span>{props.typeValues.buttonText}</span>}

            {pending && <CircularProgress size={28} />}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default AuthForm;
