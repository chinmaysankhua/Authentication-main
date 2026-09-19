import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useRef,useContext } from 'react';
import { useHistory } from 'react-router-dom';
const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const history = useHistory()
  const authCtx = useContext(AuthContext)
  const submitHandler = (event)=>{
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAXhOcSSSkvtZgGp-L0Fg_6nN5JP4iyM-k",
      {
          method:'POST',
          body:JSON.stringify({
           idToken:authCtx.token,
           password:enteredNewPassword,
           returnSecureToken:false
          }),
          headers:{
            'Content-Type':'application/json'
          }
        }).then(res=>{
          console.log(res.json())
          history.replace("/")
        })
  }
  return (
    <form className={classes.form} onSubmit={submitHandler} >
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
