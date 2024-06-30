import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate,useParams } from "react-router-dom";
import MetaData from "../layout/metadata";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";

const ResetPassword = () => {

  const dispatch = useDispatch();
  const alert = useAlert();

  const navigate = useNavigate();
  const {token} = useParams();

  const { success, error, loading } = useSelector((state) => state.forgotPassword);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token,myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    if (success) {
      alert.success("Password Updated Successfully");
      navigate("/login");
    }
  }, [dispatch, error, alert, navigate, success]);

  return (
    <>
        {loading?(<Loader/>):(
            <Fragment>
                <MetaData title="Reset Password" />
                <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h2 className="resetPasswordHeading">Reset Password</h2>
                    <form
                    className="resetPasswordForm"
                    onSubmit={resetPasswordSubmit}
                    >
                    <div className="newPassword">
                        <LockOpenIcon />
                        <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="confirmPassword">
                        <LockIcon />
                        <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <input
                        type="submit"
                        value="Reset Password"
                        className="resetPasswordBtn"
                        // disabled = {loading?true:false}
                    />
                    </form>
                </div>
                </div>
            </Fragment>
        )}
    </>
  )
}

export default ResetPassword