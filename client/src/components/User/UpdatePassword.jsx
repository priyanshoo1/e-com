import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/metadata";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const navigate = useNavigate();

  const { isUpdated, error, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <>
        {loading?(<Loader/>):(
            <Fragment>
                <MetaData title="Update Password" />
                <div className="updatePasswordContainer">
                <div className="updatePasswordBox">
                    <h2 className="updatePasswordHeading">Update Profile</h2>
                    <form
                    className="updatePasswordForm"
                    encType="multipart/form-data"
                    onSubmit={updatePasswordSubmit}
                    >
                    <div className="Password">
                        <VpnKeyIcon />
                        <input
                        type="password"
                        placeholder="Old Password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon />
                        <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="loginPassword">
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
                        value="Change Password"
                        className="updatePasswordBtn"
                        // disabled = {loading?true:false}
                    />
                    </form>
                </div>
                </div>
            </Fragment>
        )}
    </>
  );
};

export default UpdatePassword;
